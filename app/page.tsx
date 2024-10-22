import React from "react";
import LoginForm from "@/app/components/LoginForm";

export const metadata = {
    title: "Login"
}
export default function Home() {

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-semibold text-gray-800 text-center">NEVER PANEL</h1>
                <p className="mt-2 text-sm text-gray-500 text-center">Log in to your account</p>
                <LoginForm/>
            </div>
            <footer className="mt-8 text-sm text-gray-500 text-center">
                © {new Date().getFullYear()} NEVERBE. All Rights Reserved.
            </footer>
        </main>
    );
}
