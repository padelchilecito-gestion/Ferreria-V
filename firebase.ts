import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// REEMPLAZA ESTE OBJETO CON TU CONFIGURACIÓN REAL DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDOdfaEbl3wfMd3ysAEqmHaWsKuEe4WSXo",
  authDomain: "ferreria-v.firebaseapp.com",
  projectId: "ferreria-v",
  storageBucket: "ferreria-v.firebasestorage.app",
  messagingSenderId: "343884858198",
  appId: "1:343884858198:web:1bc47f2d5d74a0f0dc4cf7",
  measurementId: "G-458BQ9JP5X"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
