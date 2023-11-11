// config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Your Firebase config here
  apiKey: "AIzaSyDYdE1xz3i6QDiige2FnTqmmj4PLHWljG8",
  authDomain: "setermproject-5ea97.firebaseapp.com",
  databaseURL: "https://setermproject-5ea97-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "setermproject-5ea97",
  storageBucket: "setermproject-5ea97.appspot.com",
  messagingSenderId: "533125317536",
  appId: "1:533125317536:web:aff9cf62a7fbcb855f5ac5",
  measurementId: "G-HFDFGLWCCN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app }; // Exporting both auth and app