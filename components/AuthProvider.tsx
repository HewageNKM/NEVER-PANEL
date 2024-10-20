"use client";
import React, {ReactNode, useState} from 'react';
import {setUser} from "@/lib/userSlice/userSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import LoadingView from "@/components/LoadingView";
import {getUserById, logout, observeAuthState} from "@/firebase/firebaseClient";

const AuthProvider = ({children}: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true)
    const dispatch: AppDispatch = useDispatch();

    try {
        observeAuthState((user) => {
            if (user != null) {
                getUserById(user.uid).then((user) => {
                    if (user) {
                        dispatch(setUser(user));
                    } else {
                        console.log("User not found!");
                    }
                }).catch((e) => {
                    logout().then(() => {
                        console.log("User Logged out!")
                    })
                    console.error(e);
                }).finally(() => {
                    setIsLoading(false);
                });
            } else {
                setIsLoading(false);
            }
        });
    } catch (e: any) {
        console.error(e);
    }
    return (
        <>
            {isLoading ? (<LoadingView/>) : (children)}
        </>
    );
};

export default AuthProvider;
