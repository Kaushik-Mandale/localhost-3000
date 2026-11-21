import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// User's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoPYsAYfOeu7OHXI30JYr_L8ArqZS2gKc",
  authDomain: "localhost3000-6ed4c.firebaseapp.com",
  projectId: "localhost3000-6ed4c",
  storageBucket: "localhost3000-6ed4c.firebasestorage.app",
  messagingSenderId: "822321248197",
  appId: "1:822321248197:web:0e2546fe8e7b16890b7dac",
  measurementId: "G-SHVRSBGTR3"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Analytics (optional/browser only)
export let analytics: any = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // Analytics is non-critical
  }
}
