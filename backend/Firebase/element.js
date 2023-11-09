// Import the functions you need from the SDKs you need
const { initializeApp } = "firebase/app";
const { getAnalytics } = "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAt-J0vIPDsVVUU0N9n0hUWhBz8tVzODk8",
  authDomain: "accessibility-bus.firebaseapp.com",
  projectId: "accessibility-bus",
  storageBucket: "accessibility-bus.appspot.com",
  messagingSenderId: "357215610655",
  appId: "1:357215610655:web:7f3102bac00d137675322a",
  measurementId: "G-MDZDXV222Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getAnalytics(app);