"use client";
import React, {ReactNode, useEffect, useState} from 'react';
import {getUserById, observeAuthState} from "@/firebase/firebaseConfig";
import {setUser} from "@/lib/userSlice/userSlice";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import LoadingView from "@/app/components/LoadingView";
import {setShowProfileMenu} from "@/lib/profileSlice/profileSlice";

const AuthProvider = ({children}: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true)
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        try {
            observeAuthState((user) => {
                if (user != null) {
                    getUserById(user.uid).then((user) => {
                        dispatch(setUser(user));
                    }).catch(() => {
                        router.replace("unauthorized");
                        throw new Error("User not found, Please contact administrator!");
                    }).finally(() => {
                        setIsLoading(false);
                    });
                } else {
                    router.replace("unauthorized");
                    setIsLoading(false);
                    throw new Error("User not found, Please contact administrator!");
                }
            });
        } catch (e: any) {
            console.error(e);
        }
    })
    return (
        <>
            {isLoading ? (<LoadingView/>) : (children)}
        </>
    );
};

export default AuthProvider;
