"use client"
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {RxAvatar} from "react-icons/rx";
import Image from "next/image";
import Link from "next/link";
import {AnimatePresence, motion} from "framer-motion";
import {clearUser} from "@/lib/userSlice/userSlice";
import {useRouter} from "next/navigation";
import {logout} from "@/firebase/serviceAPI";

const Profile = () => {
    const [date, setDate] = useState(new Date());
    const [showMenu, setShowMenu] = useState(false)
    const dispatch:AppDispatch = useDispatch();
    const router = useRouter();

    const {user} = useSelector((state: RootState) => state.authSlice);
    const userLogout = async () => {
        await logout();
        dispatch(clearUser());
        router.replace("/")
    }

    useEffect(() => {
        const updateClock = () => {
            const d = new Date();
            setDate(d);
        };

        updateClock();
        const intervalId = setInterval(updateClock, 1000);

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);

    return (
        <div className="absolute top-5 z-40 h-[4rem] w-[13rem] flex justify-center items-center right-3 shadow-primary rounded-full">
            <div className="p-2 relative rounded-full flex justify-center items-center">
                {user?.imageUrl ? (<Image src={user?.imageUrl} className="bg-cover w-10 h-10" alt={user?.username}/>) : (
                    <button onClick={()=>setShowMenu(prevState => !prevState)}><RxAvatar size={40}/></button>)}
                <AnimatePresence>
                    {showMenu && (
                        <motion.div animate={{opacity:1,y:0}} exit={{opacity:0,y:'1vh'}} initial={{opacity:0,y:'1vh'}} className="absolute z-50 -bottom-[7.3rem] -right-[7rem] bg-white shadow-primary p-2 rounded-lg">
                            <p className="text-xs font-bold">{user?.username}</p>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                            <ul className="mt-2 text-lg">
                                <li className="hover:text-primary-100 font-medium"><Link href="">Profile</Link></li>
                                <li className='hover:text-primary-100 font-medium'><button onClick={()=> userLogout()}>Logout</button></li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="px-2 flex flex-col">
                <h3 className="font-medium w-[7rem] text-lg">
                    {date.toLocaleTimeString()}
                </h3>
                <p className="text-sm font-medium">
                    {date.toDateString()}
                </p>
            </div>
        </div>
    );
};

export default Profile;
