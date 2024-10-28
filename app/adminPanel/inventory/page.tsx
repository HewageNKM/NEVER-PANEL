import React from 'react';
import InventoryManage from "@/app/adminPanel/inventory/components/InventoryManage";
import {Metadata} from "next";
import {Item} from "@/interfaces";
import {getInventoryItems} from "@/firebase/firebaseAdmin";

export const metadata: Metadata = {
    title: "Inventory",
    description: "InventoryManage page for managing inventory."
}
const Page = async () => {
    let items: Item[] = []

    try {
        items.push(...await getInventoryItems());
    } catch (error: any) {
        console.error(error);
    }

    return (
        <main className="relative w-full h-screen">
            <section
                className="md:pt-24 pt-32 flex flex-col relative justify-center lg:justify-between items-center lg:items-stretch">
                <h1 className="text-3xl px-4 py-4 font-bold">Inventory</h1>
                <InventoryManage it={items}/>
            </section>
        </main>
    );
};

export const dynamic = 'force-dynamic'
export default Page;
