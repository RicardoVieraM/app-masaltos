// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkFvRTVclDfSrzKwlIXhRrlwt15WfOWy0",
  authDomain: "masaltos-app.firebaseapp.com",
  projectId: "masaltos-app",
  storageBucket: "masaltos-app.firebasestorage.app",
  messagingSenderId: "224866707202",
  appId: "1:224866707202:web:d2535de5fbefbc1f02441b",
  measurementId: "G-RV7E7YN8CK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
