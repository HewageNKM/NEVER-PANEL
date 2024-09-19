import React from 'react';
import DropShadow from "@/components/DropShadow";

const PageLoading = () => {
    return (
        <DropShadow>
            <div className="w-full flex justify-center items-center">
                <div className="w-32 h-32 border-t-4 border-b-4 border-gray-400 rounded-full animate-spin"/>
            </div>
        </DropShadow>
    );
};

export default PageLoading;
