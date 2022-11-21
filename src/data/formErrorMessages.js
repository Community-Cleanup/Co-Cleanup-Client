// For consistency, use these error messages throughout the client app where possible
// For use for client-side validation on both user input, and Firebase (client) request/response errors
// Note that our server API app is configured to send down its own user-friendly error messages,
// should a server-side error occur.

export const formErrorMessages = {
  showFieldRequired: () => {
    return "This field is required";
  },
  showValidEmailRequired: () => {
    return "Email is not a valid address";
  },
  showMinimumPasswordLength: (minLength) => {
    return `Minimum password length is ${minLength} characters`;
  },
  showPasswordsDontMatch: () => {
    return "Password does not match";
  },
  showDefaultSubmitError: () => {
    return "Please fix any errors displayed";
  },
  showUsernameTakenError: (username) => {
    return `That username (${username}) had already been taken, please try another`;
  },
  showEmailTakenError: (emailAddress) => {
    return `An account with that email address (${emailAddress}) already exists`;
  },
  showUnexpectedError: () => {
    return "Something unexpected occured";
  },
  showEmptyPasswordError: () => {
    return "Password cannot be blank";
  },
  showWrongPasswordError: () => {
    return "Incorrect password";
  },
  showEmailNotFoundError: (emailAddress) => {
    return `An account with that email address (${emailAddress}) was not found`;
  },
};
