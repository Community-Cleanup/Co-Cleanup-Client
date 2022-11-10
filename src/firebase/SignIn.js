import { useGlobalAuthState } from "../utils/AuthContext";
import { firebaseAuth, signInWithEmailAndPassword } from "./firebaseApp";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Note that unlike in SignUp.js, we don't need to explicity use Axios to send a POST request to
// `${process.env.REACT_APP_SERVER_URL}/api/users/find-current-user`, to send our token up in a header,
// as the Firebase token change observer setup in `utils/AuthObserver.js` will detect the token
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
    console.log("ERROR caught signing in user: ", errorCode, errorMessage);
  }
}

export default SignIn;
