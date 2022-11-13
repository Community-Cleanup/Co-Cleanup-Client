import "./SignupAndSignInPage.css";
import SignIn from "../firebase/SignIn";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalAuthState } from "../utils/AuthContext";

function SigninPage() {
  const { authState } = useGlobalAuthState();

  const [signInFormState, setSignInFormState] = useState({
    emailAddress: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (authState.data) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [authState.data]);

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      await SignIn(signInFormState.emailAddress, signInFormState.password);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  function handleChange(event) {
    setSignInFormState((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
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
            value={signInFormState.emailAddress}
            onChange={(e) => handleChange(e)}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={signInFormState.password}
            onChange={(e) => handleChange(e)}
          />
        </fieldset>
        <input type="submit" value="Submit" id="submit" />
      </form>
    </main>
  );
}

export default SigninPage;
