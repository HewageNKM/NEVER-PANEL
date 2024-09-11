"use client";
import Toast from "@/components/Toast";
import {AnimatePresence} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getUserById, logUser, observeAuthState} from "@/firebase/firebaseConfig";
import {showToast} from "@/lib/toastSlice/toastSlice";
import {FaEye} from "react-icons/fa";
import {FaEyeSlash} from "react-icons/fa6";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {setUser} from "@/lib/userSlice/userSlice";
import LoadingView from "@/app/components/LoadingView";

export default function Home() {
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter();

    const isToastShowing = useSelector((state: RootState) => state.toastSlice.showToast);
    const dispatch: AppDispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false)

    const onFormSubmit = async (evt: any) => {
        evt.preventDefault();
        const {email, password} = evt.target;
        try {
            const credential = await logUser(email.value, password.value);

            // Set user if exists or show error
            if (credential.user != null) {
                const user = await getUserById(credential.user.uid);
                if (user == null) {
                    throw new Error("User not found, Please contact administrator!");
                } else {
                    dispatch(setUser(user));
                    router.replace("/adminPanel");
                }
            }
        } catch (e: any) {
            setToast(e)
            console.error(e);
        }
    }

    useEffect(() => {
        try {
            observeAuthState((user) => {
                if (user != null) {
                    getUserById(user.uid).then((user) => {
                        dispatch(setUser(user));
                        router.replace("/adminPanel");
                    }).catch((e) => {
                        setIsLoading(false);
                        setToast(e)
                    })
                } else {
                    setIsLoading(false);
                }
            });
        } catch (e: any) {
            setToast(e);
        }
    })

    const setToast = (e: any) => {
        dispatch(showToast({
            message: e.message.split("/")[1]?.substring(0, e.message?.split("/")[1].length - 2)?.replace("-", " ") || "Something went wrong",
            type: "Error",
            showToast: true
        }));
        setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 5000);
    }
    return (

        <main className="relative overflow-clip flex min-w-full min-h-screen flex-col items-center justify-center">
            {isLoading ? <LoadingView/> : <div className="px-12 py-8">
                <h1 className="text-4xl font-bold">NEVER PANEL</h1>
                <p className="text-sm capitalize text-slate-500 ">Login to your account using provided credentials</p>
                <div className="mt-4 w-full flex-row flex">
                    <form onSubmit={(evt) => onFormSubmit(evt)} className="flex flex-col gap-5 w-full">
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-lg">Email</span>
                            <input name="email" type="email" required placeholder="Email"
                                   className="bg-slate-200 rounded h-[7vh] px-4 py-2"/>
                        </label>
                        <label className="flex-col relative flex gap-1">
                            <span className="font-medium text-lg">Password</span>
                            <input name="password" type={!showPassword ? "password" : "text"} required
                                   placeholder="Password" className="bg-slate-200 rounded h-[7vh] px-4 py-2 pr-8"/>
                            <button onClick={() => setShowPassword(prevState => !prevState)} type={"button"}
                                    className="absolute top-[2.6rem] right-2">
                                {showPassword ? <FaEye size={20}/> : <FaEyeSlash size={20}/>}
                            </button>
                        </label>
                        <button type="submit"
                                className="bg-black rounded-lg text-white px-4 py-2 font-bold hover:bg-gray-900 hover:scale-105 transition-all duration-300">Login
                        </button>
                    </form>
                </div>
            </div>}
            <footer>
                <p className="text-sm text-slate-500">© {new Date().getFullYear().toString()} NEVERBE. All Rights
                    Reserved.</p>
            </footer>
            <AnimatePresence>
                {isToastShowing && <Toast/>}
            </AnimatePresence>
        </main>
    )
}
