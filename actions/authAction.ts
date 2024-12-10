import {auth} from "@/firebase/firebaseClient"
import {signInWithEmailAndPassword} from "@firebase/auth"
import axios from "axios";

export const authenticateUser = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await auth.currentUser?.getIdToken();

    const response = await axios({
        method: 'GET',
        url: `/api/v1/users/${credential.user.uid}`,
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    return response.data;
}

export const checkUser = async (uid:string,token:string) => {
    const response = await axios({
        method: 'GET',
        url: `/api/v1/users/${uid}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}


