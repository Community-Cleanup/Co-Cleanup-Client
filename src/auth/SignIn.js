import { firebaseAuth, signInWithEmailAndPassword } from "./firebaseApp";

import { formErrorMessages } from "../data/formErrorMessages";

// Note that unlike in `./SignUp.js`, we don't need to explicity use Axios here to send a POST request,
// to send our ID token up in a header to our server API endpoints,
// as our Firebase auth observer setup in `../auth/AuthObserver.js` will automatically detect the new ID token from Firebase,
// which will then use Axios to send the token up to the server API.

async function SignIn(emailAddress, password) {
  try {
    const signInResult = await signInWithEmailAndPassword(
      firebaseAuth,
      emailAddress,
      password
    );
    return signInResult;
  } catch (error) {
    const errorCode = error.code;
    console.log(`Error caught signing in user on Firebase: ${error}`);
    if (errorCode === "auth/wrong-password") {
      throw new Error(`Error: ${formErrorMessages.showWrongPasswordError()}`);
    } else if (errorCode === "auth/user-not-found") {
      throw new Error(
        `Error: ${formErrorMessages.showEmailNotFoundError(emailAddress)}`
      );
    } else {
      throw new Error(error);
    }
  }
}

export { SignIn };
