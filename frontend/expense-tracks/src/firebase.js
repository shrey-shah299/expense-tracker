// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getAnalytics} from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDs8q4xdxRHh06Ezc-aPYnpxL9lKYpfoew",
  authDomain: "expense-tracker-a7292.firebaseapp.com",
  projectId: "expense-tracker-a7292",
  storageBucket: "expense-tracker-a7292.firebasestorage.app",
  messagingSenderId: "372544432057",
  appId: "1:372544432057:web:60cb39298cb55663817868",
  measurementId: "G-30YMFSRMFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);