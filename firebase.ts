// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
}// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOdfaEbl3wfMd3ysAEqmHaWsKuEe4WSXo",
  authDomain: "ferreria-v.firebaseapp.com",
  projectId: "ferreria-v",
  storageBucket: "ferreria-v.firebasestorage.app",
  messagingSenderId: "343884858198",
  appId: "1:343884858198:web:1bc47f2d5d74a0f0dc4cf7",
  measurementId: "G-458BQ9JP5X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
