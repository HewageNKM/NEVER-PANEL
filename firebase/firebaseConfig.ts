import {initializeApp} from "firebase/app";
import {
    browserLocalPersistence,
    getAuth,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword
} from "@firebase/auth";
import {collection, doc, getDoc, getFirestore} from "@firebase/firestore";

// Firebase configuration
const firebaseConfig = {
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
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);


const usersCollectionRef = collection(db, "users");

export const logUser = async (email: string, password: string) => {
    await setPersistence(auth, browserLocalPersistence);
    return await signInWithEmailAndPassword(auth, email, password);
};

export const getUserById = async (id: string) => {
    const document = await getDoc(doc(usersCollectionRef, id));
    return document.data();
};

export const observeAuthState = (callback: (user: any) => void) => {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}
