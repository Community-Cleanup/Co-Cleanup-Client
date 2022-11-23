import { firebaseAuth, createUserWithEmailAndPassword } from "./firebaseApp";
import axios from "axios";
import { formErrorMessages } from "../data/formErrorMessages";

async function checkUsernameUniqueness(username) {
  let res = null;
  try {
    res = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/users/check-username-uniqueness`,
      {
        username: username,
      }
    );
  } catch (error) {
    throw new Error(
      `Error: ${formErrorMessages.showUsernameTakenError(username)}`
    );
  }

  if (res.data.usernameExists) {
    throw new Error(
      `Error: ${formErrorMessages.showUsernameTakenError(username)}`
    );
  }
}

async function createUserOnFirebase(emailAddress, password) {
  let token = "";
  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      emailAddress,
      password
    );
    const user = userCredential.user;
    token = await user.getIdToken();
    return token;
  } catch (error) {
    const errorCode = error.code;
    console.log(`Error caught creating new user on Firebase: ${error}`);
    if (errorCode === "auth/email-already-in-use") {
      throw new Error(
        `Error: ${formErrorMessages.showEmailTakenError(emailAddress)}`
      );
    } else {
      throw new Error(`Error: ${formErrorMessages.showUnexpectedError()}`);
    }
  }
}

async function createUserOnMongoDB(username, token) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/users/create-current-user`,
      {
        username: username,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res;
  } catch (error) {
    console.log(
      `Error in POST to ${process.env.REACT_APP_SERVER_URL}/api/users/create-current-user with error data:`,
      error
    );

    throw new Error(`Error: ${formErrorMessages.showUnexpectedError()}`);
  }
}

// 'SignUp' function used by our Sign Up form.
// This function conducts the following in order (assuming each step is successful):
// 1. Check that the user's chosen username is unique in MongoDB
// 2. Create the new user's account on Firebase Auth (client) with the email address and password
// 3. Create a user document on our MongoDB user model on our server app
async function SignUp(username, emailAddress, password) {
  // Firstly we need to query MongoDB on our Server API app to confirm that the
  // user's chosen username is unique (i.e. hasn't already been taken by another user).
  // This needs to be done first because otherwise in the following functions, the
  // new user is created successfully on Firebase, but can't also be created on our MongoDB user model,
  // then there's going to be a bad account unsync issue between Firebase's database and our MongoDB database

  await checkUsernameUniqueness(username);

  // Use Firebase client SDK to try and create a new user on Firebase with their chosen email and password
  // and if successful, return the ID token of the user and then automatically sign in the user.
  // Note that we're not storing the user's chosen username with Firebase directly.
  const token = await createUserOnFirebase(emailAddress, password);

  let response = null;
  // Only if a successful token response is generated from Firebase then attempt to create the user on MongoDB via
  // our server app
  if (token) {
    response = await createUserOnMongoDB(username, token);
  }
  return response;
}

export { SignUp };
