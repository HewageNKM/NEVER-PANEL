"use client"
import {useParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {getItemById} from "@/firebase/serviceAPI";
import {Item} from "@/interfaces";
import Image from "next/image";
import {IoAdd, IoPencil} from "react-icons/io5";
import VariantCard from "@/app/adminPanel/inventory/components/VariantCard";


const Page = () => {
    const [item, setItem] = useState<Item>({buyingPrice: 0, discount: 0, sellingPrice: 0, type: "", itemId: "", name: "", manufacturer: "", brand: "", thumbnail: "", variants: []})
    const {itemId} = useParams<{ itemId: string }>()

    const fetchItem = async () => {
        const item = await getItemById(itemId);
        if (item) {
            setItem(item)
        }
    }

    useEffect(() => {
        if (itemId) {
            fetchItem();
        }
    }, [itemId])

    return (
        <div className="w-full h-full px-8 py-8">
            <div>
                <h1 className="pt-20 text-4xl md:text-5xl font-bold">Item Details</h1>
             <div className="mt-1 text-lg flex-row flex gap-1">
                 <a href="/adminPanel/inventory" className="text-blue-500">
                     Inventory
                 </a>
                 <p>/</p>
                 <a href={`/adminPanel/inventory/${item.itemId}`} className="text-blue-500">
                     {item.itemId}
                 </a>
             </div>
            </div>
            <div className="flex pt-10 flex-row gap-16 px-2 md:gap-16 lg:gap-32 justify-center items-center flex-wrap">
                <div>
                    <Image src={item?.thumbnail} alt={item?.name} width={300} height={300} className="w-fit md:h-[35rem] h-[25rem] rounded-lg shadow-primary"/>
                </div>
                <div className="capitalize text-lg md:text-2xl font-medium flex flex-col gap-2">
                    <p className="uppercase line-clamp-1">ID: {item?.itemId}</p>
                    <p>Manufacture: {item?.manufacturer}</p>
                    <p>Brand: {item?.brand}</p>
                    <p>Name: {item?.name}</p>
                    <p className="text-blue-500">{item?.variants.length} Variants</p>
                    <button
                        className="mt-5 rounded-full text-white lg:hover:bg-primary-200 transition-all bg-primary-100 p-2 flex-row flex justify-center items-center">
                        <IoAdd color="white" size={30}/>
                        <span>
                            Add Variant
                        </span>
                    </button>
                </div>
            </div>
            <div className="pt-10 font-bold text-4xl md:text-5xl">
                <h1>Variants</h1>
                <div className="w-full mt-10 flex flex-row md:gap-16 gap-10 flex-wrap justify-center items-center">
                    {item?.variants.map((variant, index) => (
                        <VariantCard item={variant} key={index}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;
