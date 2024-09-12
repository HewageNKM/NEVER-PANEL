import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "@/app/styles/globals.css";
import StoreProvider from "@/components/StoreProvider";
import AuthProvider from "@/components/AuthProvider";
import ToastProvider from "@/components/ToastProvider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "NEVER PANEL",
    description: "NEVER ADMIN PANEL FOR MANGING NEVERBE WEBSITE.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <StoreProvider>
            <ToastProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </ToastProvider>
        </StoreProvider>
        </body>
        </html>
    );
}
