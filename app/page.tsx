"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { showToast } from "@/lib/toastSlice/toastSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { setUser } from "@/lib/userSlice/userSlice";
import Lottie from "lottie-react";
import { ButtonLoading } from "@/assets/animations";
import { getCurrentUser, getUserById, logUser } from "@/firebase/firebaseClient";

export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { user } = useSelector((state: RootState) => state.authSlice);

    if (getCurrentUser() && user) {
        redirect("/adminPanel");
    }

    const dispatch: AppDispatch = useDispatch();

    const onFormSubmit = async (evt: any) => {
        setIsLoading(true);
        evt.preventDefault();
        const { email, password } = evt.target;
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
        setTimeout(() => dispatch(showToast({ message: "", type: "", showToast: false })), 5000);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-semibold text-gray-800 text-center">NEVER PANEL</h1>
                <p className="mt-2 text-sm text-gray-500 text-center">Log in to your account</p>
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
                            {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                        </button>
                    </label>
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="bg-blue-600 text-white font-semibold rounded-lg py-2 px-4 mt-4 transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                    >
                        {isLoading ? (
                            <div className="flex justify-center">
                                <Lottie animationData={ButtonLoading} className="h-10" />
                            </div>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
            <footer className="mt-8 text-sm text-gray-500 text-center">
                © {new Date().getFullYear()} NEVERBE. All Rights Reserved.
            </footer>
        </main>
    );
}
