"use client"
import React, {ReactNode} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";

const Layout = ({children}: { children: ReactNode }) => {
    const {} = useSelector((state: RootState) => state);
    return (
        <>
            {children}
        </>
    );
};

export default Layout;
