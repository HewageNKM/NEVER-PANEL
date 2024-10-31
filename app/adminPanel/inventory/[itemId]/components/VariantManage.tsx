"use client"
import React, {useState} from 'react';
import Image from "next/image";
import {IoAdd} from "react-icons/io5";
import VariantCard from "@/app/adminPanel/inventory/[itemId]/components/VariantCard";
import VariantForm from "@/app/adminPanel/inventory/[itemId]/components/VariantForm";
import {Item, Variant} from "@/interfaces";
import {useDispatch} from "react-redux";
import {getToken} from "@/firebase/firebaseClient";
import {hideLoader, showLoader} from "@/lib/pageLoaderSlice/pageLoaderSlice";
import {showToast} from "@/lib/toastSlice/toastSlice";
import EmptyState from "@/components/EmptyState";
import axios from "axios";

const VariantManage = ({it}: { it: Item }) => {
    const [addVariantForm, setAddVariantForm] = useState(false);
    const [variant, setVariant] = useState<Variant | null>(null);
    const [item, setItem] = useState<Item>(it);

    const dispatch = useDispatch();

    const deleteVariant = async (variantId: string) => {
        const response = confirm(`Are you sure you want to delete this variant with ID ${variantId}?`);
        if (response) {
            try {
                dispatch(showLoader());
                const updatedVariants = item.variants.filter(variant => variant.variantId !== variantId);
                // ToDO delete variant images
                const token = await getToken()

                const newItem: Item = {
                    ...item,
                    variants: updatedVariants,
                }

                const res = await axios({
                    method: "PUT",
                    url: `/api/inventory/${item.itemId}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: JSON.stringify(newItem)
                });
                if (res.status == 200) {
                    setItem(prevState => ({...prevState, variants: updatedVariants}));
                    showDisplayMessage("VariantManage deleted successfully", "Success");
                }
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
        dispatch(showToast({message: msg, type}));
    };
    return (
        <>
            <div className="flex pt-10 flex-row gap-16 px-2 md:gap-16 lg:gap-32 justify-center items-center flex-wrap">
                <div className="w-full md:w-[25rem] h-[25rem]">
                    <Image
                        src={item?.thumbnail.url}
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
                    <p className="text-yellow-400">Buying Price: LKR {item.buyingPrice}</p>
                    <p className="text-green-400">Selling Price: LKR {item.sellingPrice}</p>
                    <p >CreatedAt: {new Date(item.createdAt).toLocaleString()}</p>
                    <p >UpdatedAt: {new Date(item.updatedAt).toLocaleString()}</p>
                    <p className="text-blue-500">{item?.variants.length} Variants</p>
                    <button
                        onClick={() => setAddVariantForm(true)}
                        className="mt-5 rounded-full text-white bg-primary-100 p-2 flex items-center justify-center hover:bg-primary-200 transition-all">
                        <IoAdd color="white" size={30}/>
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
                    {item?.variants.length === 0 && <EmptyState title={"Not Found!"} subtitle={"Add Items"}/>}
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
        </>
    );
};

export default VariantManage;