import {browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword} from "@firebase/auth";
import {deleteDoc, doc, getDoc, getDocs, query, setDoc, where} from "@firebase/firestore";
import {auth, inventoryCollectionRef, usersCollectionRef} from "@/firebase/config";
import {Item} from "@/interfaces";

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
    await setDoc(doc(inventoryCollectionRef, item.itemId), item, {merge: true});
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

export const filterInventoryByBrands = async (brand:string) => {
    const filteredQuery = query(inventoryCollectionRef, where("manufacturer", "==", brand));
    const docs = await getDocs(filteredQuery);
    let items: Item[] = [];
    docs.forEach(doc => {
        items.push(doc.data() as Item);
    })
    return items ? items : [];
}

export const searchInventoryByPhrase = async (name:string) => {
    const filteredQuery = query(inventoryCollectionRef, where("name", "==", name), where("itemId", "==", name), where("manufacturer", "==", name));
    const docs = await getDocs(filteredQuery);
    let items: Item[] = [];
    docs.forEach(doc => {
        items.push(doc.data() as Item);
    })
    return items ? items : [];
}
