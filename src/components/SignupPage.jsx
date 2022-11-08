import "./SignupAndSignInPage.css";
import { useState } from "react";
import {
  firebaseAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "../firebase/firebaseApp";
import axios from "axios";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // const [formSubmitSuccessful, setFormSubmitSuccessful] = useState(false);

  async function handleOnSubmit(e) {
    e.preventDefault();

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
      // To Do:
      // Store this token in a cookie
      console.log("USER ID TOKEN IS: ", token);

      // To Do:
      // set token to cookie
      // send this token to backend
      // backend will check if the token is valid (using firebase admin tool)
      // if it is verified, we'll use the backend to save the user to the Mongo database, if the user doesn't exist there already

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/users/current-user`,
          {
            username: username,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        // To Do:
        // Save user from DB to state
        console.log("Data Saved", res.status, res.data);
      } catch (error) {
        console.log(
          `Error in POST to ${process.env.REACT_APP_SERVER_URL}/api/users/current-user with error data:`,
          error
        );
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("ERROR caught creating user: ", errorCode, errorMessage);
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
