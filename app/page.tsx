"use client";
import Toast from "@/components/Toast";
import {AnimatePresence} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getCurrentUser, getUserById, logUser} from "@/firebase/firebaseConfig";
import {showToast} from "@/lib/toastSlice/toastSlice";
import {FaEye} from "react-icons/fa";
import {FaEyeSlash} from "react-icons/fa6";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {setUser} from "@/lib/userSlice/userSlice";
import Lottie from "lottie-react";
import {ButtonLoading} from "@/assets/animations";

export default function Home() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const {user} = useSelector((state: RootState) => state.authSlice);

    if (getCurrentUser() && user) {
        router.replace("/adminPanel");
    }

    const isToastShowing = useSelector((state: RootState) => state.toastSlice.showToast);
    const dispatch: AppDispatch = useDispatch();

    const onFormSubmit = async (evt: any) => {
        setIsLoading(true);
        evt.preventDefault();
        const {email, password} = evt.target;
        try {
            const credential = await logUser(email.value, password.value);

            // Set user if exists or show error
            if (credential.user) {
                const user = await getUserById(credential.user.uid);

                if (user) {
                    dispatch(setUser(user));
                    router.replace("/adminPanel");
                } else {
                    setToast("User not found, Please contact administrator!");
                }
            }
        } catch (e: any) {
            setToast("Invalid credentials, Please try again!");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    const setToast = (message: string) => {
        dispatch(showToast({
            message: message,
            type: "Error",
            showToast: true
        }));
        setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 5000);
    }
    return (

        <main className="relative overflow-clip flex min-w-full min-h-screen flex-col items-center justify-center">
            <div className="px-12 py-8">
                <h1 className="text-4xl font-bold">NEVER PANEL</h1>
                <p className="text-sm capitalize text-slate-500 ">Login to your account using provided credentials</p>
                <div className="mt-4 w-full flex-row flex relative">
                    <form onSubmit={(evt) => onFormSubmit(evt)} className="flex flex-col gap-5 w-full">
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-lg">Email</span>
                            <input disabled={isLoading} name="email" type="email" required placeholder="Email"
                                   className="bg-slate-200 rounded h-[7vh] px-4 py-2"/>
                        </label>
                        <label className="flex-col relative flex gap-1">
                            <span className="font-medium text-lg">Password</span>
                            <input disabled={isLoading} name="password" type={!showPassword ? "password" : "text"}
                                   required
                                   placeholder="Password" className="bg-slate-200 rounded h-[7vh] px-4 py-2 pr-8"/>
                            <button onClick={() => setShowPassword(prevState => !prevState)} type={"button"}
                                    className="absolute top-[2.6rem] right-2">
                                {showPassword ? <FaEye size={20}/> : <FaEyeSlash size={20}/>}
                            </button>
                        </label>
                        {isLoading && <div className="absolute w-full bottom-4  justify-center"><Lottie
                            animationData={ButtonLoading} className="h-20"/></div>}
                        <button disabled={isLoading} type="submit"
                                className="bg-black rounded-lg text-white mt-5 px-4 py-2 font-bold hover:bg-gray-900 hover:scale-105 transition-all duration-300">
                            Login
                        </button>
                    </form>
                </div>
            </div>
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
