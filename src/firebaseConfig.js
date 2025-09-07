// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyA2KTP8VolDAdNtSIkvsjI_sePCq14OgFg",
//   authDomain: "watches-a47f3.firebaseapp.com",
//   projectId: "watches-a47f3",
//   storageBucket: "watches-a47f3.firebasestorage.app",
//   messagingSenderId: "563869557887",
//   appId: "1:563869557887:web:ffa6b22bf053ae2b318b4a",
//   measurementId: "G-84VHFG9NL0"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics"; // مش ضروري غير لو فعلاً عاوز Analytics

// ✅ Config بتاع مشروعك
const firebaseConfig = {
  apiKey: "AIzaSyA2KTP8VolDAdNtSIkvsjI_sePCq14OgFg",
  authDomain: "watches-a47f3.firebaseapp.com",
  projectId: "watches-a47f3",
  storageBucket: "watches-a47f3.appspot.com", // 👈 خلي بالك: لازم تبقى .appspot.com مش firebasestorage.app
  messagingSenderId: "563869557887",
  appId: "1:563869557887:web:ffa6b22bf053ae2b318b4a",
  measurementId: "G-84VHFG9NL0"
};

// ✅ Initialize once
const app = initializeApp(firebaseConfig);

// ✅ Auth instance
export const auth = getAuth(app);

// (اختياري) لو عايز Analytics:
// export const analytics = getAnalytics(app);
