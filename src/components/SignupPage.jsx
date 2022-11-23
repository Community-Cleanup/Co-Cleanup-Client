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
import { Logo } from "./styled/elements/Logo.styled";
import { Navigation } from "./styled/elements/Navigation.styled";
import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Input } from "./styled/elements/Input.styled";
import { FormLabel } from "./styled/elements/FormLabel.styled";
import { FormMessage } from "./styled/elements/FormMessage.styled";
import { Button } from "./styled/elements/Button.styled";
import { theme } from "./styled/theme/Theme";

function SignupPage() {
  // useGlobalAuthState() contains the details of the current logged in user
  const { authState } = useGlobalAuthState();

  // Sign Up form state including error messages for each input field, and submit errors, and
  // to keep a boolean status of whether or not to show the loading spinner icon
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

  // For input fields to be controlled components, we need to keep the input field values in state
  function handleChange(event) {
    setSignUpFormState((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  // Checks if any input fields are empty.
  // This is triggered by the forms onBlur event, meaning when the user takes cursor focus out of the input field.
  // Updates error messsage (using our static imported formErrorMessages object for consistency) if input field is left empty.
  function checkEmptyField(event) {
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
  }

  // Checks for valid email syntax based off a regex pattern
  // and updates state with error message if email is not valid
  function checkValidEmailSyntax(event) {
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
      } else {
        setSignUpFormState((prev) => {
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
      if (signUpFormState.password.length < 6) {
        setSignUpFormState((prev) => {
          return {
            ...prev,
            passwordError: `Error: ${formErrorMessages.showMinimumPasswordLength(
              6
            )}`,
          };
        });
      } else {
        setSignUpFormState((prev) => {
          return {
            ...prev,
            passwordError: "",
          };
        });
      }
    }
  }

  // Checks if the values in the password confirmation field matches the password field exactly
  // and if it doesn't display an error message
  function checkPasswordConfirmError(event) {
    if (`${event.target.name}` === "passwordConfirm") {
      if (event.target.value !== signUpFormState.password) {
        setSignUpFormState((prev) => {
          return {
            ...prev,
            passwordConfirmError: `Error: ${formErrorMessages.showPasswordsDontMatch()}`,
          };
        });
      } else {
        setSignUpFormState((prev) => {
          return {
            ...prev,
            passwordConfirmError: "",
          };
        });
      }
    }
  }

  // The following four functions are triggered onBlur (i.e. on field focus loss)
  // for every field.
  // The event object will keep track of the specific field's name and value
  function validateOnBlur(event) {
    checkEmptyField(event);

    checkValidEmailSyntax(event);

    checkPasswordError(event);

    checkPasswordConfirmError(event);
  }

  // If the user is already signed in, they shouldn't be able to access this sign up page
  // so navigate them back to the Landing Page automatically
  useEffect(() => {
    // We can easily check if the user is already signed in by checking if our global auth state, data object holds the
    // current user's details in state
    if (authState.data) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [authState.data]);

  // If our '../auth/AuthObserver.js' auth observer/listener detects an error when the user tries to sign up,
  // as per the boolean value in authState.authObserverError state property, then force a logout of the user.
  // This likely won't ever occur because unlike with Sign In in './SigninPage.jsx', the Sign Up process will
  // mean a brand new ID token and a new user's account certainly isn't disabled by default.
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

  // This is called immediately after clicking the submit button to
  // check if there's still any errors displayed from the above onBlur functions,
  // and if so, prompt the user to fix all these errors before submitting again
  function checkAnyInvalidFields() {
    const {
      usernameError,
      emailAddressError,
      passwordError,
      passwordConfirmError,
    } = signUpFormState;

    // Do an OR comparison with all input field values to see if there are any errors still in any of the input fields
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
      return true;
    } else {
      setSignUpFormState((prev) => {
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

    // Only begin processing the sign up and show the loading spinner icon if there are no client-side validation errors
    if (!checkAnyInvalidFields()) {
      setSignUpFormState((prev) => {
        return {
          ...prev,
          showLoadingSpinner: true,
        };
      });

      // Attempt the sign up with our SignUp handler in '../auth/SignUp.js'
      let signUpResponse;
      try {
        signUpResponse = await SignUp(
          signUpFormState.username,
          signUpFormState.emailAddress,
          signUpFormState.password
        );
      } catch (error) {
        // The error response here will likely be either from:
        // - Our server app responding that the chosen username has already been taken
        // - Or, a response from Firebase that the chosen email address is already in use by another account
        // - Or, a response from Firebase that the chosen password doesn't meet the Firebase minimum length requirements
        // Also hide the loading spinner icon using state if there is any error so that the user can try again with form submit
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
        // Probably not really necessary to force a Sign In here, as the functionality in
        // '../auth/SignUp.js' should trigger an automatic Sign In as per stated in the docs
        // for 'createUserWithEmailAndPassword' here: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#createuserwithemailandpassword
        // But it doesn't hurt.
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
  }

  // Styled components are passed props to help fine tune different CSS properties
  return (
    <PageTitle title="Sign Up">
      <Container margin="120px auto">
        <Container talign="center">
          {/* As there is no nav bar on the Sign Up page, clicking the Co Cleanup logo will 
          navigate the user back to the Landing Page */}
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
        {/* The actual Sign Up form components */}
        <form onSubmit={handleFormSubmit}>
          <Fieldset>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              w="400px"
              onBlur={(e) => validateOnBlur(e)}
              type="text"
              name="username"
              id="username"
              value={signUpFormState.username}
              onChange={(e) => handleChange(e)}
            />
            {/* If there is a username validation error in state, display the error message here */}
            {signUpFormState.usernameError && (
              <FormMessage>{signUpFormState.usernameError}</FormMessage>
            )}
          </Fieldset>
          <Fieldset>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              w="400px"
              onBlur={(e) => validateOnBlur(e)}
              type="email"
              placeholder="example@email.com"
              name="emailAddress"
              id="emailAddress"
              value={signUpFormState.emailAddress}
              onChange={(e) => handleChange(e)}
            />
            {/* If there is an email address validation error in state, display the error message here */}
            {signUpFormState.emailAddressError && (
              <FormMessage>{signUpFormState.emailAddressError}</FormMessage>
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
              value={signUpFormState.password}
              onChange={(e) => handleChange(e)}
            />
            {/* If there is a password validation error in state, display the error message here */}
            {signUpFormState.passwordError && (
              <FormMessage>{signUpFormState.passwordError}</FormMessage>
            )}
          </Fieldset>
          <Fieldset>
            <FormLabel htmlFor="passwordConfirm">Confirm Password</FormLabel>
            <Input
              w="400px"
              onBlur={(e) => validateOnBlur(e)}
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              value={signUpFormState.passwordConfirm}
              onChange={(e) => handleChange(e)}
            />
            {/* If there is a password confirmation validation error in state, display the error message here */}
            {signUpFormState.passwordConfirmError && (
              <FormMessage>{signUpFormState.passwordConfirmError}</FormMessage>
            )}
          </Fieldset>
          <Fieldset>
            {/* Show the loading spinner on form submit if there are no other client-side validation errors */}
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
            {/* If there are any form submission errors in state, display the error message here */}
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
