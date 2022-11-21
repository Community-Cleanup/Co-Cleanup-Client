import { useState, useEffect } from "react";
import { Logout } from "../auth/Logout";
import { SignUp } from "../auth/SignUp";
import { SignIn } from "../auth/SignIn";
import { useNavigate, Link } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
import { formErrorMessages } from "../data/formErrorMessages";
import LoadingSpinner from "./LoadingSpinner";
import PageTitle from "./PageTitle";
import { Container } from "./styled/utility/Container.styled";
import { Flex } from "./styled/utility/Flex.styled";
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
          [`${event.target.name}Error`]: `Error: ${formErrorMessages.showFieldRequired()}`,
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
            emailAddressError: `Error: ${formErrorMessages.showValidEmailRequired()}`,
          };
        });
      }
    }

    if (`${event.target.name}` === "password") {
      if (signUpFormState.password.length < 6) {
        setSignUpFormState((prev) => {
          return {
            ...prev,
            passwordError: `Error: ${formErrorMessages.showMinimumPasswordLength(
              6
            )}`,
          };
        });
      }
    }

    if (`${event.target.name}` === "passwordConfirm") {
      if (event.target.value !== signUpFormState.password) {
        setSignUpFormState((prev) => {
          return {
            ...prev,
            passwordConfirmError: `Error: ${formErrorMessages.showPasswordsDontMatch()}`,
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
          submitError: `Error: ${formErrorMessages.showDefaultSubmitError()}`,
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
    <PageTitle title="Sign Up">
      <Container margin="120px auto">
        <Container talign="center">
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
        </Container>
        <form onSubmit={handleFormSubmit}>
          <Fieldset>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              w="400px"
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
              w="400px"
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
              w="400px"
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
              w="400px"
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
                w="400px"
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
      </Container>
    </PageTitle>
  );
}

export default SignupPage;
