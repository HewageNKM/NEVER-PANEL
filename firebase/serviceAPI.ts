import {browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword} from "@firebase/auth";
import {doc, getDoc} from "@firebase/firestore";
import {auth, usersCollectionRef} from "@/firebase/config";

export const logUser = async (email: string, password: string) => {
    await setPersistence(auth, browserLocalPersistence);
    return await signInWithEmailAndPassword(auth, email, password);
};

export const getUserById = async (id: string) => {
    const document = await getDoc(doc(usersCollectionRef, id));
    return document ? document.data() : null;
};

export const observeAuthState = (callback: (user: any) => void) => {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}
export const getCurrentUser = () => {
    return auth.currentUser;
}
export const logout = async () => {
    await auth.signOut();
}
