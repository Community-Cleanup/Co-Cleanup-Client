// This component will wrap App.js so that we can keep track of user's auth state

import React, { useEffect } from "react";
import { firebaseAuth } from "../firebase/firebaseApp";
import axios from "axios";

import { useGlobalAuthState } from "./AuthContext";

const AuthObserver = ({ children }) => {
  const { setAuthState } = useGlobalAuthState();

  useEffect(() => {
    // Firebase function 'onIdTokenChanged' adds an observer for changes to the signed-in user's ID token,
    // which includes sign-in, sign-out, and token refresh events.
    // On initial webpage load, this function below will get called twice! The first time to 'register' the observer (i.e. the listener),
    // and the second time immediately after to check change to the 'User' object in the callback below
    // Refer to the list of calls/event raises here - https://firebase.google.com/docs/reference/unity/class/firebase/auth/firebase-auth#idtokenchanged
    return firebaseAuth.onIdTokenChanged(async (user) => {
      if (!user) {
        console.log(
          "AuthObserver component detected the current Firebase user isn't signed in"
        );

        // It was automatically detected that the Firebase user isn't signed in anymore, so clear state
        setAuthState((prev) => {
          return {
            ...prev,
            data: null,
          };
        });
      } else if (user) {
        console.log(
          "AuthObserver component detected Firebase user Sign Up, Sign In, or token refresh event"
        );

        // If we decide to store the token in a cookie, could do that here
        // instead of the client browser's 'IndexedDB/firebaseLocalStorage'
        // This will returns the current token if it has not expired or if it will not expire in the next five minutes
        const { token } = await user.getIdTokenResult();

        // Send the token to the back-end to verify validity of the token,
        // and if successful, respond with the "hopefully" found user from the Mongo DB

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
            // due to raised events as per the docs here - https://firebase.google.com/docs/reference/unity/class/firebase/auth/firebase-auth#idtokenchanged
            // as such, the app will first throw a 404 error when calling the above API endpoint with Axios, but this "first" event raised can be safely ignored.
            console.log(
              error.response.status === 404
                ? "Ignore initial 404 error to find user from DB whilst auth observer is still registering."
                : error
            );
          });

        if (res && res.status === 200) {
          console.log(
            `Status ${res.status} - Successfully returned current user from Mongo database with DB data:`
          );
          console.log(res.data);
          // Save user from Mongo DB res to React global state
          setAuthState((prev) => {
            return {
              ...prev,
              data: res.data,
            };
          });
          console.log(`Added current user's data from Mongo to React state.`);
        }
      } else {
        console.log("AuthObserver listener registered");
      }
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
