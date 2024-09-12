"use client";
import React, {ReactNode} from 'react';
import Toast from "@/components/Toast";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import {AnimatePresence} from "framer-motion";

const ToastProvider = ({children}:{children:ReactNode}) => {
    const {showToast} = useSelector((state:RootState) => state.toastSlice);
    return (
        <>
            {children}
            <AnimatePresence>
                {showToast && <Toast/>}
            </AnimatePresence>
        </>
    );
};

export default ToastProvider;
