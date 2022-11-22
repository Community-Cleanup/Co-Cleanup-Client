// This component will wrap App.js so that we can keep track of user's auth state

import React, { useEffect } from "react";
import { firebaseAuth } from "./firebaseApp";
import axios from "axios";

import { useGlobalAuthState } from "../utils/AuthContext";

// This helper component, 'AuthObserver', as a utility, is very important for the entire authentication system for React.
//
// With thanks to the Firebase client SDK function 'onIdTokenChanged' (see comments below in the 'useEffect'), our React app has the ability
// to maintain session persistence, even when a signed in user closes their web browser and opens it again.
//
// Firebase stores the user's ID token/JWT in local storage likened to a cookie on the user's browser.
// This observer/listener, using 'onIdTokenChanged' function,
// acts as event handler that can be fired anytime throughout the whole app lifecycle
// whenever a change is detected to the token, such as a user clearing their browser data,
// the user signs in and gets a token from Firebase, they manually click the logout button,
// or the token expires (at which point they will automatically be logged out).
// This also saves the need of having to manually handling a refresh token for Firebase.

const AuthObserver = ({ children }) => {
  const { setAuthState } = useGlobalAuthState();

  function clearUserAuthState() {
    setAuthState((prev) => {
      return {
        ...prev,
        data: null,
      };
    });
  }

  function addUserAuthState(res) {
    setAuthState((prev) => {
      return {
        ...prev,
        data: res.data,
      };
    });
  }

  async function fetchUserFromServer(user) {
    // If we decide to store the token in a cookie, could do that here
    // instead of the client browser's 'IndexedDB/firebaseLocalStorage'
    // This will returns the current token if it has not expired or if it will not expire in the next five minutes
    const { token } = await user.getIdTokenResult();

    // Send the token to our back-end server API to verify validity of the token,
    // and if successful, respond with the "hopefully" found user document from MongoDB
    const res = await axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/find-current-user`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((error) => {
        // When the user clicks the submit button on the Sign Up form, this 'onIdTokenChanged' function gets called multiple times,
        // due to raised events as per the docs here - https://firebase.google.com/docs/reference/unity/class/auth/auth/firebase-auth#idtokenchanged
        // as such, only on Sign Up the app will first throw a 500 error when calling the above API endpoint with Axios,
        // but this "first" event raised can be safely ignored.
        if (error.response.status === 500) {
          console.log(
            "Ignore initial 500 error to find user from DB whilst auth observer is still registering."
          );
        } else {
          setAuthState((prev) => {
            return {
              ...prev,
              authObserverError: error.response.data,
            };
          });
        }
      });
    return res;
  }

  useEffect(() => {
    // Firebase function 'onIdTokenChanged' adds an observer for changes to the signed-in user's ID token,
    // which includes sign-in, sign-out, and token refresh events.
    // On initial webpage load, this function below will get called twice! The first time to 'register' the observer (i.e. the listener),
    // and the second time immediately after to check change to the 'User' object in the callback below
    // Refer to the list of calls/event raises here - https://firebase.google.com/docs/reference/unity/class/auth/auth/firebase-auth#idtokenchanged
    return firebaseAuth.onIdTokenChanged(async (user) => {
      // The observer has detected that the user doesn't have a valid token, meaning that they're not signed in,
      // so clear our global auth state from React
      if (!user) {
        console.log(
          "AuthObserver component detected the current Firebase user isn't signed in"
        );
        // It was automatically detected that the Firebase user isn't signed in anymore, so clear state
        clearUserAuthState();
      }
      // Otherwise, the observer has detected that the user is signed in and they can stay signed in because their token is valid
      // The below most often occurs after the user successfully signs in
      else if (user) {
        console.log(
          "AuthObserver component detected Firebase user Sign Up, Sign In, or token refresh event"
        );

        const res = await fetchUserFromServer(user);

        // If te user's document from MongoDB was successfully retrieved from the Server API
        if (res && res.status === 200) {
          console.log(
            `Status ${res.status} - Successfully returned current user from Mongo database with DB data:`
          );
          console.log(`MongoDB user object found is: ${res.data}`);
          // Save user from MongoDB res to React global state
          addUserAuthState(res);
          console.log(`Added current user's data from Mongo to React state.`);
        }
      }
      // Set global auth state property that our observer/listener component is now registered
      // (needed to stop displaying the loading page on `../app.js`)
      setAuthState((prev) => {
        return {
          ...prev,
          authObserverRegistered: true,
        };
      });
    });
    // eslint-disable-next-line
  }, []);

  return <>{children}</>;
};

export default AuthObserver;
