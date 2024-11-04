// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANYr1MJVJJNa6w8e1b6qynPMlmECzN3IY",
  authDomain: "salesapp-790b9.firebaseapp.com",
  projectId: "salesapp-790b9",
  storageBucket: "salesapp-790b9.firebasestorage.app",
  messagingSenderId: "759874907609",
  appId: "1:759874907609:web:dfb7fc6e24cd7d96c6fdc8",
  measurementId: "G-HLV59S64PW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);    
const db = getFirestore(app)
const auth = getAuth(app)


export { db, auth };