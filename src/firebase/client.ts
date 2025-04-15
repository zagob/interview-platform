import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDIHJFnSt6pumw5LnXk8uAZd0HGe4pDVlI",
  authDomain: "prepwise-a20e3.firebaseapp.com",
  projectId: "prepwise-a20e3",
  storageBucket: "prepwise-a20e3.firebasestorage.app",
  messagingSenderId: "422033193919",
  appId: "1:422033193919:web:2fdfa9baaef07cbdbeff0a",
  measurementId: "G-Q675TGT37F",
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
