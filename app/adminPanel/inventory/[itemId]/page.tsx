import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {getItemById} from "@/firebase/firebaseAdmin";
import {notFound} from "next/navigation";
import VariantManage from "@/app/adminPanel/inventory/[itemId]/components/VariantManage";

// Dynamic metadata function
export async function generateMetadata({ params }: { params: { itemId: string } }): Promise<Metadata> {
    console.log(params.itemId);
    const item = await getItemById(params?.itemId);
    if(!item){
        return {
            title: `Item Not Found | Admin Panel`,
            description: `The item with ID ${params?.itemId} was not found in the inventory.`,
        };
    }
    return {
        title: `Details for ${item.name} | Admin Panel`,
        description: `View detailed information for the item ${item.name} in the inventory.`,
    };
};

const Page = async ({ params }: { params: { itemId: string } }) => {
    const item = await getItemById(params.itemId); // Fetch item details using the itemId
    if(!item){
        notFound();
    }
    return (
        <div className="w-full h-full relative md:mt-5 mt-10">
            <div>
                <h1 className="pt-20 text-4xl md:text-5xl px-4 py-4 font-bold">Item Details</h1>
                <div className="mt-1 text-base md:text-lg px-4 py-4 flex gap-1">
                    <Link href="/adminPanel/inventory" className="text-blue-500">Inventory</Link>
                    <span>/</span>
                    <Link href={`/adminPanel/inventory/${item.itemId}`} className="text-blue-500">{item.itemId}</Link>
                </div>
                <VariantManage it={item}/>
            </div>
        </div>
    );
};

export default Page;
