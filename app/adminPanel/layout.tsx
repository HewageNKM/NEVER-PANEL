"use client"
import React, {ReactNode} from 'react';
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import {getCurrentUser} from "@/firebase/firebaseConfig";
import Profile from "@/components/Profile";
import NavMenu from "@/components/NavMenu";

const Layout = ({children}: { children: ReactNode }) => {
    const router = useRouter();
    const {user} = useSelector((state: RootState) => state.authSlice);

    if (!user && !getCurrentUser()) {
        router.replace("/unauthorized");
    }

    if (!user) {
        router.replace("/");
    }


    return (
        <>
            <NavMenu/>
            {children}
            <Profile/>
        </>
    );
};

export default Layout;
