import { SignIn } from "../firebase/SignIn";
import { Logout } from "../firebase/Logout";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useGlobalAuthState } from "../utils/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

import { ContainerSignup } from "./styled/utility/ContainerSignup.styled";
import { Logo } from "./styled/elements/Logo.styled";
import { Navigation } from "./styled/elements/Navigation.styled";
import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Input } from "./styled/elements/Input.styled";
import { FormLabel } from "./styled/elements/FormLabel.styled";
import { FormMessage } from "./styled/elements/FormMessage.styled";
import { Button } from "./styled/elements/Button.styled";
import { theme } from "./styled/theme/Theme";

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
    <ContainerSignup>
      <div>
        <Logo
          src="./images/logo/logo-icon.svg"
          alt="Co Cleanup Logo"
          onClick={() => navigate("/")}
        />
        <h1>Sign In</h1>
        <p>
          Not a member yet?{" "}
          <Navigation fs="16px" color={theme.colors.signLink}>
            <Link to="/sign-up">Sign Up</Link>
          </Navigation>
        </p>
      </div>
      <form onSubmit={handleFormSubmit}>
        <Fieldset>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            onBlur={(e) => validate(e)}
            type="email"
            name="emailAddress"
            id="emailAddress"
            value={signInFormState.emailAddress}
            onChange={(e) => handleChange(e)}
          />
          {signInFormState.emailAddressError && (
            <FormMessage>{signInFormState.emailAddressError}</FormMessage>
          )}
        </Fieldset>
        <Fieldset>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            onBlur={(e) => validate(e)}
            type="password"
            // placeholder="Password"
            name="password"
            id="password"
            value={signInFormState.password}
            onChange={(e) => handleChange(e)}
          />
          {signInFormState.passwordError && (
            <FormMessage>{signInFormState.passwordError}</FormMessage>
          )}
        </Fieldset>
        <Fieldset>
          {signInFormState.showLoadingSpinner ? (
            <LoadingSpinner />
          ) : (
            <Button
              type="submit"
              value="Submit"
              id="submit"
              w="100%"
              margin="0"
            >
              Sign In
            </Button>
          )}

          {signInFormState.submitError && (
            <FormMessage>{signInFormState.submitError}</FormMessage>
          )}
        </Fieldset>
      </form>
    </ContainerSignup>
  );
}

export default SigninPage;
