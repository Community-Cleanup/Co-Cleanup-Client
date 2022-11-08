// This component will wrap App.js so that we can keep track of user's auth state

import React, { useEffect, useContext } from "react";
import { firebaseAuth } from "../firebase/firebaseApp";
import axios from "axios";

const FirebaseAuthProvider = ({ children }) => {
  // To Do:

  return <>{children}</>;
};

export default FirebaseAuthProvider;
