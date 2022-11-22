// This is to initialise an instance of Firebase (client)

import { initializeApp, getApps } from "firebase/app";
// We only need the below imports from Firebase Authentication (client)
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
// Firebase Analytics not used in our app currently, but might be useful in the future
import { getAnalytics } from "firebase/analytics";
// Import the public client-side Firebase keys/credentials needed to authenticate and authorise with Firebase and
// the Firebase Admin SDK on our server API app
import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase if it hasn't been initialized yet
const firebaseApp = (function initializeFirebaseApp() {
  let firebaseApp;
  // We only ever want only one instance of Firebase app
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    return firebaseApp;
  } else {
    throw new Error(
      "Firebase Client SDK has already been initialized elsewhere"
    );
  }
})();

// Add our needed Firebase products below for the initialized app:
// Such as Authentication, and Google Analytics (Google Analytics not currently used)
const googleAnalytics = getAnalytics(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  googleAnalytics,
  firebaseAuth,
};
