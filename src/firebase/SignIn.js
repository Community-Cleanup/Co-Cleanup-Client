import { firebaseAuth, signInWithEmailAndPassword } from "./firebaseApp";

// Note that unlike in `./SignUp.js`, we don't need to explicity use Axios here to send a POST request,
// to send our token up in a header to our server API endpoints,
// as our Firebase auth observer setup in `../utils/AuthObserver.js` will automatically detect the new token from Firebase,
// which will then send it up to the server API.

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
    const errorMessage = error.message;
    console.log(
      "Error caught signing in user on Firebase: ",
      errorCode,
      errorMessage
    );
    throw new Error(errorCode, errorMessage);
  }
}

export default SignIn;
