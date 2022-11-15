import { firebaseAuth, createUserWithEmailAndPassword } from "./firebaseApp";
import axios from "axios";

async function SignUp(username, emailAddress, password) {
  // Use Firebase client SDK to try and create a new user on Firebase with email and password
  // and if successful, return the ID token of the user and add their username to their profile
  let token = "";
  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      emailAddress,
      password
    );
    const user = userCredential.user;
    token = await user.getIdToken();

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
      throw new Error(error);
    }
  } catch (error) {
    const errorCode = error.code;
    console.log(`Error caught creating new user on Firebase: ${error}`);
    if (errorCode === "auth/email-already-in-use") {
      throw new Error(
        "Error: An account with that email address already exists"
      );
    } else {
      throw new Error(error);
    }
  }
}

export { SignUp };
