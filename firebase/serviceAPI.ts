import {browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword} from "@firebase/auth";
import {deleteDoc, doc, getDoc, getDocs, setDoc} from "@firebase/firestore";
import {auth, inventoryCollectionRef, usersCollectionRef} from "@/firebase/config";
import {Item} from "@/interfaces";
import {util} from "protobufjs";
import merge = util.merge;

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
export const saveToInventory = async (item: Item) => {
    await setDoc(doc(inventoryCollectionRef, item.itemId), item,{merge: true });
}
export const getInventory = async () => {
    let docs = await getDocs(inventoryCollectionRef);
    let items: Item[] = [];
    docs.forEach(doc => {
        items.push(doc.data() as Item);
    })

    return items;
}
export const deleteInventoryItem = async (itemId: string) => {
    await deleteDoc(doc(inventoryCollectionRef, itemId));
}
