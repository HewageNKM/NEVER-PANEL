"use client"
import React, {ReactNode, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {setUser} from '@/lib/authSlice/authSlice';


const GlobalProvider = ({children}: { children: ReactNode }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const neverPanelUser = window.localStorage.getItem("neverPanelUser");
        dispatch(setUser(neverPanelUser || null));
    }, []);
    return (
        <>
            {children}
        </>
    );
};

export default GlobalProvider;
