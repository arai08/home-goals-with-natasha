// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "home-goals-with-natasha.firebaseapp.com",
  projectId: "home-goals-with-natasha",
  storageBucket: "home-goals-with-natasha.firebasestorage.app",
  messagingSenderId: "693185253793",
  appId: "1:693185253793:web:693047a98724dce123bbe0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);