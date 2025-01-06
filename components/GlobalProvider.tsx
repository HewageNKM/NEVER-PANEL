"use client"
import React, {ReactNode, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {setLoading, setUser} from '@/lib/authSlice/authSlice';
import {onAuthStateChanged} from "@firebase/auth";
import {auth} from "@/firebase/firebaseClient";
import {checkUser} from "@/actions/authAction";


const GlobalProvider = ({children}: { children: ReactNode }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                const newVar = await checkUser(user.uid, token);
                if (newVar) {
                    dispatch(setUser(newVar));
                } else {
                    dispatch(setUser(null));
                }
            } else {
                dispatch(setLoading(false));
            }
        })
    }, [])
    return (
        <>
            {children}
        </>
    );
};

export default GlobalProvider;
