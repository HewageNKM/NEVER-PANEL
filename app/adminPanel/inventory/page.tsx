import React from 'react';
import InventoryManage from "@/app/adminPanel/inventory/components/InventoryManage";
import {Metadata} from "next";

export const metadata:Metadata = {
    title:"Inventory",
    description:"InventoryManage page for managing inventory."
}
const Page = () => {
    return (
        <main className="relative w-full h-screen">
            <section
                className="md:pt-24 pt-32 px-4 py-4 flex flex-col relative justify-center lg:justify-between items-center lg:items-stretch">
                <h1 className="text-3xl font-bold">Inventory</h1>
                <InventoryManage />
            </section>
        </main>
    );
};

export default Page;
