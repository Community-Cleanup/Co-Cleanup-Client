import { useGlobalAuthState } from "../utils/AuthContext";
import { firebaseAuth, signInWithEmailAndPassword } from "./firebaseApp";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
