// This component will wrap App.js so that we can keep track of user's auth state

import React, { useEffect } from "react";
import { firebaseAuth } from "../firebase/firebaseApp";
import axios from "axios";

import { useGlobalAuthState } from "./AuthContext";

const AuthObserver = ({ children }) => {
  const { authState, setAuthState } = useGlobalAuthState();

  useEffect(() => {
    // Firebase function 'onIdTokenChanged' adds an observer for changes to the signed-in user's ID token,
    // which includes sign-in, sign-out, and token refresh events.
    return firebaseAuth.onIdTokenChanged(async (user) => {
      if (!user) {
        // To Do:
        // Handle logout here, including clearing user state from React global state
      } else {
        console.log(
          "AuthObserver component detected successful Sign Up, Sign In, or token refresh event"
        );

        // If we decide to store the token in a cookie, could use that here
        // instead of the client browser's 'IndexedDB/firebaseLocalStorage'
        const { token } = await user.getIdTokenResult();

        // Send the token to the back-end to verify validity of the token,
        // and if successful, respond with the "hopefully" found user from the Mongo DB
        try {
          if (!authState.isLoading) {
            const res = await axios.post(
              `${process.env.REACT_APP_SERVER_URL}/api/users/find-current-user`,
              {},
              {
                headers: {
                  Authorization: token,
                },
              }
            );

            if (res.status === 200) {
              console.log(res);
              // Save user from DB res to React global state
              setAuthState((prev) => {
                return {
                  ...prev,
                  data: res.data,
                };
              });
            }
          }
        } catch (error) {
          console.log(
            `Error in POST to ${process.env.REACT_APP_SERVER_URL}/api/users/find-current-user with error data:`
          );
        }
      }
    });
  }, [authState.isLoading]);

  return <>{children}</>;
};

export default AuthObserver;
