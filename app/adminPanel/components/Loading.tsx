import React from 'react';
import Lottie from "lottie-react";
import {ButtonLoading} from "@/assets/animations";

const Loading = () => {
    return (
        <div className="w-full flex justify-center items-center">
            <Lottie animationData={ButtonLoading} className="w-32 h-32"/>
        </div>
    );
};

export default Loading;
