import React from 'react';
import Link from "next/link";

const Unauthorized = () => {
    return (
        <div className="flex flex-col justify-center items-center gap-1">
            <h1 className="text-3xl text-red-400 font-bold uppercase tracking-wider">Unauthorized</h1>
            <p className="text-lg text-red-200 font-bold capitalize">You are not authorized to view this page.</p>
            <Link href="/">
                Go back to home
            </Link>
        </div>
    );
};

export default Unauthorized;
