import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

function pick(key, fallbackKey) {
  return import.meta.env[key] ?? import.meta.env[fallbackKey];
}

const validationFirebaseConfig = {
  apiKey: pick("VITE_VALIDATION_FIREBASE_API_KEY", "VITE_FIREBASE_API_KEY"),
  authDomain: pick("VITE_VALIDATION_FIREBASE_AUTH_DOMAIN", "VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: pick("VITE_VALIDATION_FIREBASE_PROJECT_ID", "VITE_FIREBASE_PROJECT_ID"),
  storageBucket: pick("VITE_VALIDATION_FIREBASE_STORAGE_BUCKET", "VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: pick(
    "VITE_VALIDATION_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
  ),
  appId: pick("VITE_VALIDATION_FIREBASE_APP_ID", "VITE_FIREBASE_APP_ID"),
  measurementId: pick("VITE_VALIDATION_FIREBASE_MEASUREMENT_ID", "VITE_FIREBASE_MEASUREMENT_ID"),
};

const appName = "validation-app";
const existing = getApps().find((app) => app.name === appName);
const validationApp = existing ?? initializeApp(validationFirebaseConfig, appName);

export const validationDb = getFirestore(validationApp);

