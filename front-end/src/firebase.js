// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUfS6eChh5QBjjFXjgrQ6CU0UzWF0ab7A",
  authDomain: "santro-migrate.firebaseapp.com",
  projectId: "santro-migrate",
  storageBucket: "santro-migrate.appspot.com",
  messagingSenderId: "572407964102",
  appId: "1:572407964102:web:7d56b7c1ecad6a2c41d2c7",
  measurementId: "G-1204JD4Q4W",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export default app;
