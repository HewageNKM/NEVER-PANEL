import React from 'react';
import Hero from "@/app/adminPanel/orders/components/Hero";
import Orders from "@/app/adminPanel/orders/components/Orders";
import {Metadata} from "next";

export const metadata:Metadata = {
    title:"Orders",
    description:"Orders page for managing orders."
}
const Page = () => {
    return (
        <main className="w-full h-full">
            <div className="mt-24">
                <h1 className="text-2xl font-bold px-8">Orders</h1>
                <div className="overflow-auto flex flex-col">
                    <Hero/>
                    <Orders />
                </div>
            </div>
        </main>
    );
};

export default Page;
