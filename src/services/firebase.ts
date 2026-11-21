import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Firebase configuration with environment variable support & fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBoPYsAYfOeu7OHXI30JYr_L8ArqZS2gKc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "localhost3000-6ed4c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "localhost3000-6ed4c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "localhost3000-6ed4c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "822321248197",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:822321248197:web:0e2546fe8e7b16890b7dac",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SHVRSBGTR3"
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
