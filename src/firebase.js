// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rentify-b8c54.firebaseapp.com",
  projectId: "rentify-b8c54",
  storageBucket: "rentify-b8c54.appspot.com",
  messagingSenderId: "627498151609",
  appId: "1:627498151609:web:2a02a42719672651123568"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);