import "./SignupAndSignInPage.css";
import { useState, useEffect } from "react";
import SignUp from "../firebase/SignUp";
import SignIn from "../firebase/SignIn";
import { useNavigate } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";

function SignupPage() {
  const [signUpFormState, setSignUpFormState] = useState({
    username: "",
    emailAddress: "",
    password: "",
    passwordConfirm: "",
  });

  const { setAuthState } = useGlobalAuthState();

  const navigate = useNavigate();

  function handleChange(event) {
    setSignUpFormState((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function handleOnSubmit(e) {
    e.preventDefault();

    // setAuthState((prev) => {
    //   return {
    //     ...prev,
    //     formProcessing: true,
    //   };
    // });

    const signUpResponse = await SignUp(
      signUpFormState.username,
      signUpFormState.emailAddress,
      signUpFormState.password
    );
    if (signUpResponse.status === 200) {
      const userCredential = await SignIn(
        signUpFormState.emailAddress,
        signUpFormState.password
      );
      if (userCredential) {
        // setAuthState((prev) => {
        //   return {
        //     ...prev,
        //     formProcessing: false,
        //   };
        // });
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
            value={signUpFormState.username}
            onChange={(e) => handleChange(e)}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email address"
            name="emailAddress"
            id="emailAddress"
            value={signUpFormState.emailAddress}
            onChange={(e) => handleChange(e)}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={signUpFormState.password}
            onChange={(e) => handleChange(e)}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            value={signUpFormState.passwordConfirm}
            onChange={(e) => handleChange(e)}
          />
        </fieldset>
        <input type="submit" value="Submit" id="submit" />
      </form>
    </main>
  );
}

export default SignupPage;
