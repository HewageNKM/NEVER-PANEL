"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { deleteFilesFromStorage, getItemById, saveToInventory } from "@/firebase/firebaseClient";
import { Item, Variant } from "@/interfaces";
import Image from "next/image";
import { IoAdd } from "react-icons/io5";
import VariantCard from "@/app/adminPanel/inventory/components/VariantCard";
import VariantForm from "@/app/adminPanel/inventory/components/VariantForm";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "@/lib/pageLoaderSlice/pageLoaderSlice";
import { showToast } from "@/lib/toastSlice/toastSlice";
import Link from "next/link";

const Page = () => {
    const [addVariantForm, setAddVariantForm] = useState(false);
    const [variant, setVariant] = useState<Variant | null>(null);
    const [item, setItem] = useState<Item>({
        buyingPrice: 0,
        discount: 0,
        sellingPrice: 0,
        type: "",
        itemId: "",
        name: "",
        manufacturer: "",
        brand: "",
        thumbnail: "",
        variants: []
    });

    const dispatch = useDispatch();
    const { itemId } = useParams<{ itemId: string }>();

    const fetchItem = async () => {
        const itemData = await getItemById(itemId);
        if (itemData) {
            setItem(itemData);
        }
    };

    useEffect(() => {
        if (itemId) {
            fetchItem();
        }
    }, [itemId]);

    const deleteVariant = async (variantId: string) => {
        const response = confirm(`Are you sure you want to delete this variant with ID ${variantId}?`);
        if (response) {
            try {
                dispatch(showLoader());
                const updatedVariants = item.variants.filter(variant => variant.variantId !== variantId);
                await deleteFilesFromStorage(`inventory/${item.itemId}/${variantId}`);
                await saveToInventory({ ...item, variants: updatedVariants });
                setItem(prevState => ({ ...prevState, variants: updatedVariants }));
                showDisplayMessage("Variant deleted successfully", "Success");
            } catch (e: any) {
                showDisplayMessage(e.message, "Error");
            } finally {
                dispatch(hideLoader());
            }
        }
    };

    const onEdit = (variant: Variant) => {
        setVariant(variant);
        setAddVariantForm(true);
    };

    const showDisplayMessage = (msg: string, type: string) => {
        dispatch(showToast({ message: msg, type }));
    };

    return (
        <div className="w-full h-full relative md:mt-5 mt-10">
            <div className="px-4 py-4">
                <h1 className="pt-20 text-4xl md:text-5xl font-bold">Item Details</h1>
                <div className="mt-1 text-base md:text-lg flex gap-1">
                    <Link href="/adminPanel/inventory" className="text-blue-500">Inventory</Link>
                    <span>/</span>
                    <Link href={`/adminPanel/inventory/${item.itemId}`} className="text-blue-500">{item.itemId}</Link>
                </div>
            </div>

            <div className="flex pt-10 flex-row gap-16 px-2 md:gap-16 lg:gap-32 justify-center items-center flex-wrap">
                <div className="w-full md:w-[25rem] h-[25rem]">
                    <Image
                        src={item?.thumbnail}
                        alt={item?.name}
                        width={300}
                        height={300}
                        className="h-full w-full rounded-lg shadow-primary"
                    />
                </div>
                <div className="capitalize text-lg md:text-2xl font-medium flex flex-col gap-2">
                    <p className="uppercase line-clamp-1">ID: {item?.itemId}</p>
                    <p>Manufacture: {item?.manufacturer}</p>
                    <p>Brand: {item?.brand}</p>
                    <p>Name: {item?.name}</p>
                    <p className="text-blue-500">{item?.variants.length} Variants</p>
                    <button
                        onClick={() => setAddVariantForm(true)}
                        className="mt-5 rounded-full text-white bg-primary-100 p-2 flex items-center justify-center hover:bg-primary-200 transition-all">
                        <IoAdd color="white" size={30} />
                        <span className="ml-2">Add Variant</span>
                    </button>
                </div>
            </div>

            <div className="pt-10 px-4 py-4 font-bold text-4xl md:text-5xl">
                <h1>Variants</h1>
                <div className="w-full mt-10 flex flex-row md:gap-16 gap-10 flex-wrap justify-center items-center">
                    {item?.variants.map((variant, index) => (
                        <VariantCard
                            item={variant}
                            key={variant.variantId} // Changed to use variantId as key for better performance
                            onPencil={() => onEdit(variant)}
                            onTrash={() => deleteVariant(variant.variantId)}
                        />
                    ))}
                </div>
            </div>

            {addVariantForm && (
                <VariantForm
                    setVariant={setVariant}
                    setAddVariantForm={setAddVariantForm}
                    variant={variant}
                    item={item}
                    setItem={setItem}
                    type={item.type}
                />
            )}
        </div>
    );
};

export default Page;
