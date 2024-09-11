"use client"
import React, {ReactNode} from 'react';
import AuthProvider from "@/components/AuthProvider";

const Layout = ({children}: { children: ReactNode }) => {
    return (
        <>
            <AuthProvider>
                {children}
            </AuthProvider>
        </>
    );
};

export default Layout;
