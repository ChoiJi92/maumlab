// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUwNCmsPqbp-9yDOB6zO2Br-B_i1MfMCo",
  authDomain: "maumlab-c0eeb.firebaseapp.com",
  projectId: "maumlab-c0eeb",
  storageBucket: "maumlab-c0eeb.appspot.com",
  messagingSenderId: "490129900786",
  appId: "1:490129900786:web:834b5fdfc25c292295fc6b",
  measurementId: "G-D8JLGBNLWT"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();