import "./SignupAndSignInPage.css";
import {
  firebaseAuth,
  signInWithEmailAndPassword,
} from "../firebase/firebaseApp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";

function SigninPage() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const { setAuthState } = useGlobalAuthState();

  const navigate = useNavigate();

  const signIn = async function () {
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
  };

  async function handleFormSubmit(e) {
    e.preventDefault();

    setAuthState((prev) => {
      return {
        ...prev,
        isLoading: true,
      };
    });

    const userCredential = await signIn();
    if (userCredential) {
      setAuthState((prev) => {
        return {
          ...prev,
          isLoading: false,
        };
      });
      navigate("/");
    }
  }

  return (
    <main className="signup-main">
      <h1>Co Cleanup</h1>
      <h1>Sign In</h1>
      <form onSubmit={handleFormSubmit}>
        <fieldset>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email address"
            name="emailAddress"
            id="emailAddress"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </fieldset>
        <input type="submit" value="Submit" id="submit" />
      </form>
    </main>
  );
}

export default SigninPage;
