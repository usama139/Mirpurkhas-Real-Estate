// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mirpurkhas-estate.firebaseapp.com",
  projectId: "mirpurkhas-estate",
  storageBucket: "mirpurkhas-estate.appspot.com",
  messagingSenderId: "615010069955",
  appId: "1:615010069955:web:f861a160831ca9e826a176"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);