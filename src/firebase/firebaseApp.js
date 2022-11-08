// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./firebaseConfig.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase if it hasn't been initialized yet
const firebaseApp = (function initializeFirebaseApp() {
  let firebaseApp;
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
// Such as Authentication, Google Analytics, and Firestore (for photo uploads)
const googleAnalytics = getAnalytics(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);

export { googleAnalytics, firebaseAuth, createUserWithEmailAndPassword };
