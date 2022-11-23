import { SignIn } from "../auth/SignIn";
import { Logout } from "../auth/Logout";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useGlobalAuthState } from "../utils/AuthContext";
import { formErrorMessages } from "../data/formErrorMessages";
import useBackSafe from "../utils/useBackSafe";

import LoadingSpinner from "./LoadingSpinner";
import PageTitle from "./PageTitle";
// styled components saved in the utilities folder apply styling to containers
// styled components saved in the elements folder apply styling to individual elements like buttons etc.
import { theme } from "./styled/theme/Theme";
import { Container } from "./styled/utility/Container.styled";
import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Logo } from "./styled/elements/Logo.styled";
import { Navigation } from "./styled/elements/Navigation.styled";
import { Input } from "./styled/elements/Input.styled";
import { FormLabel } from "./styled/elements/FormLabel.styled";
import { FormMessage } from "./styled/elements/FormMessage.styled";
import { Button } from "./styled/elements/Button.styled";

function SigninPage() {
  // useGlobalAuthState() contains the details of the current logged in user
  const { authState } = useGlobalAuthState();

  // This is a custom hook used for navigation.
  // If the user is successfully signed in, or was already sign in,
  // try to redirect them back to the previous page (see ../utils/useBackSafe.js for comments and code source)
  const { goBackSafe } = useBackSafe();

  // Sign In form state including error messages for each input field, and submit errors, and
  // to keep a boolean status of whether or not to show the loading spinner icon
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

  // If our '../auth/AuthObserver.js' auth observer/listener detects an error when the user tryies to sign in,
  // as per the boolean value in authState.authObserverError state property, then force a logout of the user.
  // This will likely occur if the user's account had been disabled by an administrator of Co Cleanup.
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

  // Checks if any input fields are empty.
  // This is triggered by the forms onBlur event, meaning when the user takes cursor focus out of the input field.
  // Updates error messsage (using our status formErrorMessages object for consistency) if input field is left empty.
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

  // Checks for valid email syntax based off a regex pattern
  // and updates state with error message if email is not valid
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

  // Like with function checkEmptyField, this checks for empty fields, but this displays
  // a specific error message if the password field is empty
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

  // The following three functions are triggered onBlue (i.e. on field focus loss)
  // for every field.
  // The event object will keep track of the specific field's name and value
  function validateOnBlur(event) {
    checkEmptyField(event);

    checkValidEmailSyntax(event);

    checkPasswordError(event);
  }

  // This is called immediately after clicking the submit button to
  // check if there's still any errors displayed from the above onBlur functions,
  // and if so, prompt the user to fix all these errors before submitting again
  function checkAnyInvalidFields() {
    const { emailAddressError, passwordError } = signInFormState;

    // Do an OR comparison to see if there are any errors still in any of the input fields
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

  // Executed on submit button click
  async function handleFormSubmit(e) {
    e.preventDefault();

    // Only begin processing the sign in and show the loading spinner icon if there are no client-side validation errors
    if (!checkAnyInvalidFields()) {
      setSignInFormState((prev) => {
        return {
          ...prev,
          showLoadingSpinner: true,
        };
      });
      try {
        // Attempt the sign in with our SignIn handler in '../auth/SignIn.js'
        await SignIn(signInFormState.emailAddress, signInFormState.password);
      } catch (error) {
        // The error response here will likely be from Firebase raising an error that the email address was not found,
        // or the password is incorrect
        // Also hide the loading spinner icon using state if there is any error so that the user can try again with form submit
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

  // For input fields to be controlled components, we need to keep the input field values in state
  function handleChange(event) {
    setSignInFormState((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  // Styled components are passed props to help fine tune different CSS properties
  return (
    <PageTitle title="Sign In">
      <Container margin="120px auto">
        <Container talign="center">
          {/* As there is no nav bar on the Sign In page, clicking the Co Cleanup logo will 
          navigate the user back to the Landing Page */}
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
        {/* The actual Sign In form components */}
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
            {/* If there is a email address validation error in state, display the error message here */}
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
              name="password"
              id="password"
              value={signInFormState.password}
              onChange={(e) => handleChange(e)}
            />
            {/* If there is a password validation error in state, display the error message here */}
            {signInFormState.passwordError && (
              <FormMessage>{signInFormState.passwordError}</FormMessage>
            )}
          </Fieldset>
          <Fieldset>
            {/* Show the loading spinner on form submit if there are no other client-side validation errors */}
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
            {/* If there are any form submission errors in state, display the error message here */}
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
