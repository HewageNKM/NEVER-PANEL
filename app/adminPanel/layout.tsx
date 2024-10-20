"use client"
import React, {ReactNode} from 'react';
import {notFound, redirect} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import {getCurrentUser} from "@/firebase/firebaseClient";
import Profile from "@/app/adminPanel/components/Profile";
import NavMenu from "@/app/adminPanel/components/NavMenu";
import PageLoadingProvider from "@/app/adminPanel/components/PageLoadingProvider";

const Layout = ({children}: { children: ReactNode }) => {
    const {user} = useSelector((state: RootState) => state.authSlice);

    if (!user && getCurrentUser()) {
        notFound()
    }else if(!user && !getCurrentUser()){
        redirect("/")
    }

    return (
        <>
            <PageLoadingProvider>
                <NavMenu/>
                {children}
                <Profile/>
            </PageLoadingProvider>

        </>
    );
};

export default Layout;
