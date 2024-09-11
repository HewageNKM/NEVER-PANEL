"use client"
import React, {ReactNode} from 'react';
import {redirect, useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import {getCurrentUser} from "@/firebase/firebaseConfig";

const Layout = ({children}: { children: ReactNode }) => {
    const router = useRouter();
    const {user} = useSelector((state: RootState) => state.authSlice);

    if (!user || !getCurrentUser()) {
        router.replace("/");
    }

    return (
        <>
            {children}
        </>
    );
};

export default Layout;
