// This component will wrap App.js so that we can keep track of user's auth state

import React, { useEffect, useContext } from "react";
import { firebaseAuth } from "../firebase/firebaseApp";
import axios from "axios";

const FirebaseAuthProvider = ({ children }) => {
  //   useEffect(() => {
  //     return firebaseAuth.onIdTokenChanged(async (user) => {
  //       console.log(
  //         "onIdTokenChanged function triggered in FirebaseAuthProvider"
  //       );
  //       if (!user) {
  //         // To Do:
  //         // Handle logout here- i.e. clear user state and clear cookie
  //       } else {
  //         const { token } = await user.getIdTokenResult();
  //         // To Do:
  //         // set token to cookie
  //         // send this token to backend
  //         // backend will check if the token is valid (using firebase admin tool)
  //         // if it is verified, we'll use the backend to save the user to the Mongo database, if the user doesn't exist there already

  //         try {
  //           const res = await axios.post(
  //             `${process.env.REACT_APP_SERVER_URL}/api/users/current-user`,
  //             {},
  //             {
  //               headers: {
  //                 Authorization: token,
  //               },
  //             }
  //           );
  //           // To Do:
  //           // Save user from DB to state
  //           console.log("Data Saved", res.status, res.data);
  //         } catch (error) {
  //           console.log(
  //             `Error in POST to ${process.env.REACT_APP_SERVER_URL}/api/users/current-user with error data:`,
  //             error
  //           );
  //         }
  //       }
  //     });
  //   }, []);

  return <>{children}</>;
};

export default FirebaseAuthProvider;
