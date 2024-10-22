"use client";
import React, {useEffect, useState} from 'react';
import {FaEye, FaEyeSlash} from "react-icons/fa";
import Lottie from "lottie-react";
import {ButtonLoading} from "@/assets/animations";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getCurrentUser, getUserById, logUser} from "@/firebase/firebaseClient";
import {setUser} from "@/lib/userSlice/userSlice";
import {showToast} from "@/lib/toastSlice/toastSlice";

const LoginForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const {user} = useSelector((state: RootState) => state.authSlice);

    const dispatch: AppDispatch = useDispatch();

    // Redirect if the user is already authenticated
    useEffect(() => {
        const checkUser = async () => {
            const currentUser = getCurrentUser();
            if (currentUser && user) {
                router.replace("/adminPanel");
            }
        };
        checkUser();
    }, [user, router]);

    const onFormSubmit = async (evt: any) => {
        setIsLoading(true);
        evt.preventDefault();
        const {email, password} = evt.target;
        try {
            const credential = await logUser(email.value, password.value);
            if (credential.user) {
                const user = await getUserById(credential.user.uid);
                if (user) {
                    dispatch(setUser(user));
                    router.replace("/adminPanel");
                } else {
                    setToast("User not found. Please contact the administrator.");
                }
            }
        } catch (e: any) {
            setToast(e.message);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const setToast = (message: string) => {
        dispatch(
            showToast({
                message: message,
                type: "Error",
                showToast: true,
            })
        );
        setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 5000);
    };
    return (
        <div>
            <form onSubmit={onFormSubmit} className="mt-6 flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                    <span className="text-lg font-medium text-gray-700">Email</span>
                    <input
                        disabled={isLoading}
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your email"
                        className="rounded-lg border border-gray-300 px-4 py-2 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                    />
                </label>
                <label className="flex flex-col gap-2 relative">
                    <span className="text-lg font-medium text-gray-700">Password</span>
                    <input
                        disabled={isLoading}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter your password"
                        className="rounded-lg border border-gray-300 px-4 py-2 pr-12 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                    />
                    <button
                        onClick={() => setShowPassword((prev) => !prev)}
                        type="button"
                        className="absolute top-12 right-4 text-gray-500 focus:outline-none"
                    >
                        {showPassword ? <FaEye size={20}/> : <FaEyeSlash size={20}/>}
                    </button>
                </label>
                <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-primary-100 text-white font-semibold rounded-lg py-2 px-4 mt-4 transition-all duration-300 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:bg-primary-300"
                >
                    {isLoading ? (
                        <div className="flex justify-center">
                            <Lottie animationData={ButtonLoading} className="h-10"/>
                        </div>
                    ) : (
                        "Login"
                    )}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;