import React from 'react';
import Lottie from "lottie-react";
import {PageLoading} from "@/assets/animations";

const LoadingView = () => {
    return (
        <div className="w-full min-h-screen flex  flex-col justify-evenly items-center">
            <Lottie animationData={PageLoading} className="w-36 h-36"/>
            <p className="text-sm text-slate-500">© {new Date().getFullYear().toString()} NEVERBE. All Rights
                Reserved.</p>
        </div>
    );
};

export default LoadingView;
