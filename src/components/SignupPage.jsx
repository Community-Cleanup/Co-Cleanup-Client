import "./SignupAndSignInPage.css";
import { useState, useEffect } from "react";
import SignUp from "../firebase/SignUp";
import SignIn from "../firebase/SignIn";
import { useNavigate } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

function SignupPage() {
  const { authState } = useGlobalAuthState();

  const [signUpFormState, setSignUpFormState] = useState({
    username: "",
    emailAddress: "",
    password: "",
    passwordConfirm: "",
    usernameError: "",
    emailAddressError: "",
    passwordError: "",
    passwordConfirmError: "",
    showLoadingSpinner: false,
    submitError: "",
  });

  const navigate = useNavigate();

  function handleChange(event) {
    setSignUpFormState((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  function validate(event) {
    if (!event.target.value) {
      setSignUpFormState((prev) => {
        return {
          ...prev,
          [`${event.target.name}Error`]: "This field is required",
        };
      });
    } else {
      setSignUpFormState((prev) => {
        return {
          ...prev,
          [`${event.target.name}Error`]: "",
        };
      });
    }

    if (`${event.target.name}` === "emailAddress") {
      // Valid email address regex pattern sourced from: https://www.w3resource.com/javascript/form/email-validation.php
      const validEmailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!signUpFormState.emailAddress.match(validEmailPattern)) {
        setSignUpFormState((prev) => {
          return {
            ...prev,
            emailAddressError: "Email is not a valid address",
          };
        });
      }
    }

    if (`${event.target.name}` === "password") {
      if (signUpFormState.password.length < 6) {
        setSignUpFormState((prev) => {
          return {
            ...prev,
            passwordError: "Minimum password length is 6 characters",
          };
        });
      }
    }

    if (`${event.target.name}` === "passwordConfirm") {
      if (event.target.value !== signUpFormState.password) {
        setSignUpFormState((prev) => {
          return {
            ...prev,
            passwordConfirmError: "Password does not match",
          };
        });
      }
    }
  }

  useEffect(() => {
    if (authState.data) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [authState.data]);

  async function handleOnSubmit(e) {
    e.preventDefault();

    const {
      usernameError,
      emailAddressError,
      passwordError,
      passwordConfirmError,
    } = signUpFormState;

    if (
      usernameError ||
      emailAddressError ||
      passwordError ||
      passwordConfirmError
    ) {
      setSignUpFormState((prev) => {
        return {
          ...prev,
          submitError: "Please fix any errors above",
        };
      });
      return;
    } else {
      setSignUpFormState((prev) => {
        return {
          ...prev,
          submitError: "",
        };
      });
    }

    setSignUpFormState((prev) => {
      return {
        ...prev,
        showLoadingSpinner: true,
      };
    });

    let signUpResponse;
    try {
      signUpResponse = await SignUp(
        signUpFormState.username,
        signUpFormState.emailAddress,
        signUpFormState.password
      );
    } catch (error) {
      setSignUpFormState((prev) => {
        return {
          ...prev,
          showLoadingSpinner: false,
        };
      });
      return error;
    }

    if (signUpResponse.status === 200) {
      try {
        await SignIn(signUpFormState.emailAddress, signUpFormState.password);
      } catch (error) {
        setSignUpFormState((prev) => {
          return {
            ...prev,
            showLoadingSpinner: false,
          };
        });
        return error;
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
            onBlur={(e) => validate(e)}
            type="text"
            placeholder="Username"
            name="username"
            id="username"
            value={signUpFormState.username}
            onChange={(e) => handleChange(e)}
          />
          {signUpFormState.usernameError && (
            <p>{signUpFormState.usernameError}</p>
          )}
        </fieldset>
        <fieldset>
          <label htmlFor="email">Email</label>
          <input
            onBlur={(e) => validate(e)}
            type="email"
            placeholder="Email address"
            name="emailAddress"
            id="emailAddress"
            value={signUpFormState.emailAddress}
            onChange={(e) => handleChange(e)}
          />
          {signUpFormState.emailAddressError && (
            <p>{signUpFormState.emailAddressError}</p>
          )}
        </fieldset>
        <fieldset>
          <label htmlFor="password">Password</label>
          <input
            onBlur={(e) => validate(e)}
            type="password"
            name="password"
            id="password"
            value={signUpFormState.password}
            onChange={(e) => handleChange(e)}
          />
          {signUpFormState.passwordError && (
            <p>{signUpFormState.passwordError}</p>
          )}
        </fieldset>
        <fieldset>
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            onBlur={(e) => validate(e)}
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            value={signUpFormState.passwordConfirm}
            onChange={(e) => handleChange(e)}
          />
          {signUpFormState.passwordConfirmError && (
            <p>{signUpFormState.passwordConfirmError}</p>
          )}
        </fieldset>
        <fieldset>
          {signUpFormState.showLoadingSpinner ? (
            <LoadingSpinner />
          ) : (
            <input type="submit" value="Submit" id="submit" />
          )}

          {signUpFormState.submitError && <p>{signUpFormState.submitError}</p>}
        </fieldset>
      </form>
    </main>
  );
}

export default SignupPage;
