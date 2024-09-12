"use client"
import React from 'react';
import Link from "next/link";
import {IoLockClosed} from "react-icons/io5";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import {getCurrentUser} from "@/firebase/serviceAPI";
import {redirect} from "next/navigation";

const Page = () => {
    const {user} = useSelector((state: RootState) => state.authSlice);

    if (user && getCurrentUser()) {
        redirect("/adminPanel");
    }

    return (
        <div className="flex w-full min-h-screen justify-center items-center bg-slate-900 text-white">
            <div className="p-8">
                <IoLockClosed size={50}/>
                <h1 className="capitalize text-2xl">Access to this page is restricted</h1>
                <p className="font-light text-slate-400">Please check with the site admin if you believe this is a mistake.</p>
                <Link href="/" className="border-b-2">Go back to home</Link>
            </div>
        </div>
    );
};

export default Page;
