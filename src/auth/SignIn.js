import { firebaseAuth, signInWithEmailAndPassword } from "./firebaseApp";

import { formErrorMessages } from "../data/formErrorMessages";

// Used by our Sign In form.
// This function is a wrapper for the Firebase Auth client 'signInWithEmailAndPassword' function below with custom error handling

// Note that unlike in `./SignUp.js`, we don't need to explicity use Axios here to send a POST request,
// to send our ID token up in a header to our server API endpoints,
// as our Firebase auth observer/listener setup in `../auth/AuthObserver.js` component will
// magically automatically detect the new ID token from Firebase, which the component will then use Axios to send the token up to the server API.

// Note regarding disabled user accounts:
// Even if the user's account had been disabled by an administrator of Co Cleanup, the Firebase sign in process below will still succeed.
// It is only when our auth observer/listener in './AuthObserver.js' detects this successful sign in event, it will query our Server API to retrieve the
// user's document from MongoDB, at which point the Server API will respond with an error response that the account is disabled. Then the user's details
// won't be added our global auth state in React, and a logout will be forced on '../components/SigninPage.jsx' to remove the token.

async function SignIn(emailAddress, password) {
  try {
    const signInResult = await signInWithEmailAndPassword(
      firebaseAuth,
      emailAddress,
      password
    );
    return signInResult;
  } catch (error) {
    // The great feature of Firebae 'signInWithEmailAndPassword' function above is that it provides automatic
    // validation and verification for us and returns the appropriate error responses below depending on the email address and/or password input
    // on the Sign In form
    const errorCode = error.code;
    console.log(`Error caught signing in user on Firebase: ${error}`);
    if (errorCode === "auth/wrong-password") {
      throw new Error(`Error: ${formErrorMessages.showWrongPasswordError()}`);
    } else if (errorCode === "auth/user-not-found") {
      throw new Error(
        `Error: ${formErrorMessages.showEmailNotFoundError(emailAddress)}`
      );
    } else if (errorCode === "auth/internal-error") {
      throw new Error(`Error: ${formErrorMessages.showUnexpectedError()}`);
    } else {
      throw new Error(error);
    }
  }
}

export { SignIn };
