"use client";
import React, {ReactNode, useState} from 'react';
import {getUserById, logout, observeAuthState} from "@/firebase/firebaseConfig";
import {setUser} from "@/lib/userSlice/userSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import LoadingView from "@/app/components/LoadingView";

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
                        console.error("User not found, Please contact administrator!");
                    }
                }).catch((e) => {
                    logout().then(() => {
                        console.error("User Logged out!")
                    })
                    console.error(e);
                }).finally(() => {
                    setIsLoading(false);
                });
            } else {
                setIsLoading(false);
                console.error("User not found, Please contact administrator!");
            }
        });
    } catch (e: any) {
        console.error(e);
    }
    console.log(isLoading)
    return (
        <>
            {isLoading ? (<LoadingView/>) : (children)}
        </>
    );
};

export default AuthProvider;
