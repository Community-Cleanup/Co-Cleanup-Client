import "./SignupAndSignInPage.css";
import SignIn from "../firebase/SignIn";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";

function SigninPage() {
  const [signInFormState, setSignInFormState] = useState({
    emailAddress: "",
    password: "",
  });

  const { setAuthState } = useGlobalAuthState();

  const navigate = useNavigate();

  async function handleFormSubmit(e) {
    e.preventDefault();

    // setAuthState((prev) => {
    //   return {
    //     ...prev,
    //     formProcessing: true,
    //   };
    // });

    const userCredential = await SignIn(
      signInFormState.emailAddress,
      signInFormState.password
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
