import {browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword} from "@firebase/auth";
import {deleteDoc, doc, getDoc, getDocs, query, setDoc, where} from "@firebase/firestore";
import {auth, inventoryCollectionRef, storage, usersCollectionRef} from "@/firebase/config";
import {Item} from "@/interfaces";
import {getDownloadURL, ref, uploadBytesResumable} from "@firebase/storage";

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

export const filterInventoryByBrands = async (brand: string) => {
    const filteredQuery = query(inventoryCollectionRef, where("manufacturer", "==", brand));
    const docs = await getDocs(filteredQuery);
    let items: Item[] = [];
    docs.forEach(doc => {
        items.push(doc.data() as Item);
    })
    return items ? items : [];
}

export const searchInventoryByPhrase = async (name: string) => {
    console.log(name);
    const filteredQuery = query(inventoryCollectionRef, where("name", "==", name));
    const docs = await getDocs(filteredQuery);
    let items: Item[] = [];
    docs.forEach(doc => {
        items.push(doc.data() as Item);
    })
    console.log(items);
    return items ? items : [];
}

export const uploadImages = async (images: File[], path: string): Promise<string[]> => {
    const urls: string[] = [];
    const uploadPromises = images.map((file) => {
        return new Promise<void>((resolve, reject) => {
            const storageRef = ref(storage, path+`/${file.file.name}`);
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