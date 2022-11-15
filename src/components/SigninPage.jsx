import "./SignupAndSignInPage.css";
import { SignIn } from "../firebase/SignIn";
import { Logout } from "../firebase/Logout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalAuthState } from "../utils/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

function SigninPage() {
  const { authState } = useGlobalAuthState();

  const [signInFormState, setSignInFormState] = useState({
    emailAddress: "",
    password: "",
    emailAddressError: "",
    passwordError: "",
    showLoadingSpinner: false,
    submitError: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (authState.data) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [authState.data]);

  useEffect(() => {
    if (authState.authObserverError) {
      Logout();
      setSignInFormState((prev) => {
        return {
          ...prev,
          showLoadingSpinner: false,
          submitError: authState.authObserverError.errorMessage,
        };
      });
    }
    // eslint-disable-next-line
  }, [authState.authObserverError]);

  function validate(event) {
    if (!event.target.value) {
      setSignInFormState((prev) => {
        return {
          ...prev,
          [`${event.target.name}Error`]: "This field is required",
        };
      });
    } else {
      setSignInFormState((prev) => {
        return {
          ...prev,
          [`${event.target.name}Error`]: "",
        };
      });
    }

    if (`${event.target.name}` === "emailAddress") {
      // Valid email address regex pattern sourced from: https://www.w3resource.com/javascript/form/email-validation.php
      const validEmailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!signInFormState.emailAddress.match(validEmailPattern)) {
        setSignInFormState((prev) => {
          return {
            ...prev,
            emailAddressError: "Email is not a valid address",
          };
        });
      }
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const { emailAddressError, passwordError } = signInFormState;

    if (emailAddressError || passwordError) {
      setSignInFormState((prev) => {
        return {
          ...prev,
          submitError: "Please fix any errors above",
        };
      });
      return;
    } else {
      setSignInFormState((prev) => {
        return {
          ...prev,
          submitError: "",
        };
      });
    }

    setSignInFormState((prev) => {
      return {
        ...prev,
        showLoadingSpinner: true,
      };
    });
    try {
      await SignIn(signInFormState.emailAddress, signInFormState.password);
    } catch (error) {
      console.log(error);
      setSignInFormState((prev) => {
        return {
          ...prev,
          showLoadingSpinner: false,
          submitError: error.message,
        };
      });
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
            onBlur={(e) => validate(e)}
            type="email"
            placeholder="Email address"
            name="emailAddress"
            id="emailAddress"
            value={signInFormState.emailAddress}
            onChange={(e) => handleChange(e)}
          />
          {signInFormState.emailAddressError && (
            <p>{signInFormState.emailAddressError}</p>
          )}
        </fieldset>
        <fieldset>
          <label htmlFor="password">Password</label>
          <input
            onBlur={(e) => validate(e)}
            type="password"
            name="password"
            id="password"
            value={signInFormState.password}
            onChange={(e) => handleChange(e)}
          />
          {signInFormState.passwordError && (
            <p>{signInFormState.passwordError}</p>
          )}
        </fieldset>
        <fieldset>
          {signInFormState.showLoadingSpinner ? (
            <LoadingSpinner />
          ) : (
            <input type="submit" value="Submit" id="submit" />
          )}

          {signInFormState.submitError && <p>{signInFormState.submitError}</p>}
        </fieldset>
      </form>
    </main>
  );
}

export default SigninPage;
