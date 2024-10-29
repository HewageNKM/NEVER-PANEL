"use client"
import React from 'react';
import DropShadow from "@/components/DropShadow";

const Loading = () => {
    return (
        <DropShadow>
            <div
                className="z-50 text-xl capitalize font-bold justify-center items-center flex m-5 animate-pulse text-white p-4 rounded-lg">
                Loading...
            </div>

        </DropShadow>
    );
};

export default Loading;