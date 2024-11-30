"use client"
import {initializeApp} from "firebase/app";
import {
    browserLocalPersistence,
    getAuth,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword
} from "@firebase/auth";
import {collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, where} from "@firebase/firestore";
import {deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytesResumable} from "@firebase/storage";
import {Item} from "@/interfaces";
// Firebase configuration
const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
