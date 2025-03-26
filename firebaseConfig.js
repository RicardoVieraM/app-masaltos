// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAyqng8b1UihZZw5uy2AlR1SQicIJUO-ss",
    authDomain: "app-masaltos.firebaseapp.com",
    projectId: "app-masaltos",
    storageBucket: "app-masaltos.firebasestorage.app",
    messagingSenderId: "908907223903",
    appId: "1:908907223903:web:65b0924cd368a96d9fb4ea"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
