import { SignIn } from "../auth/SignIn";
import { Logout } from "../auth/Logout";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useGlobalAuthState } from "../utils/AuthContext";

import { formErrorMessages } from "../data/formErrorMessages";

import LoadingSpinner from "./LoadingSpinner";
import PageTitle from "./PageTitle";
import { Container } from "./styled/utility/Container.styled";
import { Logo } from "./styled/elements/Logo.styled";
import { Navigation } from "./styled/elements/Navigation.styled";
import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Input } from "./styled/elements/Input.styled";
import { FormLabel } from "./styled/elements/FormLabel.styled";
import { FormMessage } from "./styled/elements/FormMessage.styled";
import { Button } from "./styled/elements/Button.styled";
import { theme } from "./styled/theme/Theme";

import useBackSafe from "../utils/useBackSafe";

function SigninPage() {
  const { authState } = useGlobalAuthState();

  const { goBackSafe } = useBackSafe();

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
      // If the user is successfully signed in, or was already sign in,
      // try to redirect them back to the previous page (see ../utils/useBackSafe.js for comments and code source)
      goBackSafe();
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

  function checkEmptyField(event) {
    if (!event.target.value) {
      setSignInFormState((prev) => {
        return {
          ...prev,
          [`${event.target.name}Error`]: `Error: ${formErrorMessages.showFieldRequired()}`,
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
  }

  function checkValidEmailSyntax(event) {
    if (`${event.target.name}` === "emailAddress") {
      // Valid email address regex pattern sourced from: https://www.w3resource.com/javascript/form/email-validation.php
      const validEmailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!signInFormState.emailAddress.match(validEmailPattern)) {
        setSignInFormState((prev) => {
          return {
            ...prev,
            emailAddressError: `Error: ${formErrorMessages.showValidEmailRequired()}`,
          };
        });
      } else {
        setSignInFormState((prev) => {
          return {
            ...prev,
            emailAddressError: "",
          };
        });
      }
    }
  }

  function checkPasswordError(event) {
    if (`${event.target.name}` === "password") {
      if (!event.target.value) {
        setSignInFormState((prev) => {
          return {
            ...prev,
            passwordError: `Error: ${formErrorMessages.showEmptyPasswordError()}`,
          };
        });
      } else {
        setSignInFormState((prev) => {
          return {
            ...prev,
            passwordError: "",
          };
        });
      }
    }
  }

  function validateOnBlur(event) {
    checkEmptyField(event);

    checkValidEmailSyntax(event);

    checkPasswordError(event);
  }

  function checkAnyInvalidFields() {
    const { emailAddressError, passwordError } = signInFormState;

    if (emailAddressError || passwordError) {
      setSignInFormState((prev) => {
        return {
          ...prev,
          submitError: `Error: ${formErrorMessages.showDefaultSubmitError()}`,
        };
      });
      return true;
    } else {
      setSignInFormState((prev) => {
        return {
          ...prev,
          submitError: "",
        };
      });
      return false;
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    if (!checkAnyInvalidFields()) {
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
  }

  function handleChange(event) {
    setSignInFormState((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  // styled components are passed props to help fine tune different css properties
  return (
    <PageTitle title="Sign In">
      <Container margin="120px auto">
        <Container talign="center">
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
        </Container>
        <form onSubmit={handleFormSubmit}>
          <Fieldset>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              w="400px"
              onBlur={(e) => validateOnBlur(e)}
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
              w="400px"
              onBlur={(e) => validateOnBlur(e)}
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
      </Container>
    </PageTitle>
  );
}

export default SigninPage;
