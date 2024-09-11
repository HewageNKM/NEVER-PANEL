"use client"
import React from 'react';
import Image from "next/image";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";

const Profile = () => {
    const {user} = useSelector((state:RootState) => state.authSlice);
    return (
        <div className="absolute top-5 flex justify-center items-center right-3 shadow-primary rounded-full">
            <div className="p-2 rounded-full">
                {user?.imageUrl.length == 0 ? <Image width={30} height={30} src={user.imageUrl} alt="prfile"/> : <span className="text-2xl font-bold">No</span>}
                <Image width={30} height={30} src={""} alt="prfile"/>
            </div>
        </div>
    );
};

export default Profile;
