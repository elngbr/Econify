// src/firebase-config.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// EVERYTHINH HERE IS TAKEN FRM FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDgJ_hwJV8t1m3A6NdSsrk-57CZwMq7qn4",
  authDomain: "anonymus-grading-application.firebaseapp.com",
  projectId: "anonymus-grading-application",
  storageBucket: "anonymus-grading-application.appspot.com",
  messagingSenderId: "116800621101",
  appId: "1:116800621101:web:52d91927d98e49a527c6a4",
  measurementId: "G-ETJXXJ57T0",
};

// we initialize firebase
const app = initializeApp(firebaseConfig);

// intialize firebase with google authentification
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); //this is a simple constructor... :) : ) :)

// Export auth and sign-in methods  these METHODS ARE IN FIREBASE!!!!!!!!!!!!!!!!!!!!!!!!!
export { auth, provider, signInWithPopup, signOut };
