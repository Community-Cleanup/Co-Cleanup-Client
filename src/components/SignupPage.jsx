import "./SignupAndSignInPage.css";
import { useState } from "react";
import {
  firebaseAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../firebase/firebaseApp";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { setAuthState } = useGlobalAuthState();

  const navigate = useNavigate();

  const signUp = async function () {
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
              Authorization: token,
            },
          }
        );

        return res;
      } catch (error) {
        console.log(
          `Error in POST to ${process.env.REACT_APP_SERVER_URL}/api/users/create-current-user with error data:`,
          error
        );
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("ERROR caught creating user: ", errorCode, errorMessage);
    }
  };

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

  async function handleOnSubmit(e) {
    e.preventDefault();

    setAuthState((prev) => {
      return {
        ...prev,
        isLoading: true,
      };
    });

    const signUpResponse = await signUp();
    if (signUpResponse.status === 200) {
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
  }

  return (
    <main className="signup-main">
      <h1>Co Cleanup</h1>
      <h1>Sign Up</h1>
      <form onSubmit={handleOnSubmit}>
        <fieldset>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Username"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </fieldset>
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
        <fieldset>
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </fieldset>
        <input type="submit" value="Submit" id="submit" />
      </form>
    </main>
  );
}

export default SignupPage;
