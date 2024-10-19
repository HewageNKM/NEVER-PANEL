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
export const storage = getStorage(app);

// Firestore collection references
export const usersCollectionRef = collection(db, "users");
export const inventoryCollectionRef = collection(db, "inventory");


export const logUser = async (email: string, password: string) => {
    await setPersistence(auth, browserLocalPersistence);
    return await signInWithEmailAndPassword(auth, email, password);
};
export const getItemById = async (id: string) => {
    const document = await getDoc(doc(inventoryCollectionRef, id));
    return document ? document.data() as Item : null;
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
export const filterInventoryByBrands = async (brand: string) => {
    const filteredQuery = query(inventoryCollectionRef, where("manufacturer", "==", brand));
    const docs = await getDocs(filteredQuery);
    let items: Item[] = [];
    docs.forEach(doc => {
        items.push(doc.data() as Item);
    })
    return items ? items : [];
}
export const uploadImages = async (images: File[], path: string): Promise<string[]> => {
    const urls: string[] = [];
    const uploadPromises = images.map((file) => {
        console.log(file)
        return new Promise<void>((resolve, reject) => {
            const storageRef = ref(storage, path + `/${file.file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file.file);
            uploadTask.on("state_changed", {
                error: (error) => {
                    console.log(error);
                    reject(error);
                },
                complete: async () => {
                    try {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        urls.push(url);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
    });

    await Promise.all(uploadPromises);
    return urls;
}
export const deleteFilesFromStorage = async (path: string) => {
    const storageRef = ref(storage, path);
    const {items, prefixes} = await listAll(storageRef);
    console.log(items);
    const deletePromises = items.map((item) => {
        return deleteObject(item);
    });
    const deletePrefixPromises = prefixes.map((prefix) => {
        return deleteFilesFromStorage(prefix.fullPath);
    });
    await Promise.all(deletePromises);
    await Promise.all(deletePrefixPromises);
}
export const getToken = () => {
    return auth?.currentUser?.getIdToken();
}
