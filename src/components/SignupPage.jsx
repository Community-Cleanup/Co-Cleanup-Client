import { useState, useEffect } from "react";
import { Logout } from "../firebase/Logout";
import { SignUp } from "../firebase/SignUp";
import { SignIn } from "../firebase/SignIn";
import { useNavigate, Link } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

import { CenteredContainer } from "./styled/utility/CenteredContainer.styled";
import { Logo } from "./styled/elements/Logo.styled";
import { Navigation } from "./styled/elements/Navigation.styled";
import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Input } from "./styled/elements/Input.styled";
import { FormLabel } from "./styled/elements/FormLabel.styled";
import { FormMessage } from "./styled/elements/FormMessage.styled";
import { Button } from "./styled/elements/Button.styled";
import { theme } from "./styled/theme/Theme";

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

  useEffect(() => {
    if (authState.authObserverError) {
      Logout();
      setSignUpFormState((prev) => {
        return {
          ...prev,
          showLoadingSpinner: false,
          submitError: authState.authObserverError.errorMessage,
        };
      });
    }
    // eslint-disable-next-line
  }, [authState.authObserverError]);

  async function handleFormSubmit(e) {
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
          submitError: error.message,
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
            submitError: error.message,
          };
        });
        return error;
      }
    }
  }

  return (
    <CenteredContainer>
      <div>
        <Logo
          src="./images/logo/logo-icon.svg"
          alt="Co Cleanup Logo"
          onClick={() => navigate("/")}
        />
        <h1>Sign Up</h1>
        <p>
          Already have an account?{" "}
          <Navigation fs="16px" color={theme.colors.signLink}>
            <Link to="/sign-in">Sign In</Link>
          </Navigation>
        </p>
      </div>
      <form onSubmit={handleFormSubmit}>
        <Fieldset>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            onBlur={(e) => validate(e)}
            type="text"
            name="username"
            id="username"
            value={signUpFormState.username}
            onChange={(e) => handleChange(e)}
          />
          {signUpFormState.usernameError && (
            <FormMessage>{signUpFormState.usernameError}</FormMessage>
          )}
        </Fieldset>
        <Fieldset>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            onBlur={(e) => validate(e)}
            type="email"
            placeholder="example@email.com"
            name="emailAddress"
            id="emailAddress"
            value={signUpFormState.emailAddress}
            onChange={(e) => handleChange(e)}
          />
          {signUpFormState.emailAddressError && (
            <FormMessage>{signUpFormState.emailAddressError}</FormMessage>
          )}
        </Fieldset>
        <Fieldset>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            onBlur={(e) => validate(e)}
            type="password"
            name="password"
            id="password"
            value={signUpFormState.password}
            onChange={(e) => handleChange(e)}
          />
          {signUpFormState.passwordError && (
            <FormMessage>{signUpFormState.passwordError}</FormMessage>
          )}
        </Fieldset>
        <Fieldset>
          <FormLabel htmlFor="passwordConfirm">Confirm Password</FormLabel>
          <Input
            onBlur={(e) => validate(e)}
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            value={signUpFormState.passwordConfirm}
            onChange={(e) => handleChange(e)}
          />
          {signUpFormState.passwordConfirmError && (
            <FormMessage>{signUpFormState.passwordConfirmError}</FormMessage>
          )}
        </Fieldset>
        <Fieldset>
          {signUpFormState.showLoadingSpinner ? (
            <LoadingSpinner />
          ) : (
            <Button
              type="submit"
              value="Submit"
              id="submit"
              w="100%"
              margin="0"
            >
              Sign Up
            </Button>
          )}

          {signUpFormState.submitError && (
            <FormMessage>{signUpFormState.submitError}</FormMessage>
          )}
        </Fieldset>
      </form>
    </CenteredContainer>
  );
}

export default SignupPage;
