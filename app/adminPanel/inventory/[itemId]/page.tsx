"use client"
import {useParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {getItemById} from "@/firebase/serviceAPI";
import {Item, Variant} from "@/interfaces";
import Image from "next/image";
import {IoAdd} from "react-icons/io5";
import VariantCard from "@/app/adminPanel/inventory/components/VariantCard";
import VariantForm from "@/app/adminPanel/inventory/components/VariantForm";
import {useDispatch} from "react-redux";


const Page = () => {

    // Variant Form
    const [addVariantForm, setAddVariantForm] = useState(false)
    const [variant, setVariant] = useState({} as Variant)

    const dispatch = useDispatch();


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
    })
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

    const onVariantFormSubmit = async (evt: any) => {
        evt.preventDefault();
        /*        if (images.length === 0) {
            return;
        }

        if (sizes.length === 0) {
            return;
        }
        if (images[0].file === '') {
            selectedItem.variants = selectedItem.variants.map((v) => v.variantId === variantId ? {
                ...v, sizes: sizes, variantName: variantName.toLowerCase()
            } : v)
            dispatch(showLoader())
            setSelectedItem(selectedItem)
        } else {
            const genId = generateId("variant", selectedItem.itemId)
            try {
                dispatch(showLoader())
                const imagesUrl = await uploadImages(variant.images, `inventory/${item.itemId}/${genId.toLowerCase()}/`)
                const variant: Variant = {
                    images: imagesUrl,
                    sizes: sizes,
                    variantId: genId.toLowerCase(),
                    variantName: variantName.toLowerCase()
                }
                selectedItem.variants.push(variant)
                setSelectedItem(selectedItem)
            } catch (e: any) {
                console.log(e)
            } finally {
                dispatch(hideLoader())
            }
        }*/
    }

    const deleteVariant = async (variantId: string) => {
        const response = confirm(`Are you sure you want to delete this variant with ID ${variantId}?`);
        /*if (response) {
            try {
                selectedItem.variants = selectedItem.variants.filter(variant => variant.variantId !== variantId);
                await deleteFilesFromStorage(`inventory/${item.itemId}/${variantId}`)
                setSelectedItem(selectedItem)
            } catch (e: any) {
                console.log(e.message)
            }
        }*/
    }
    const onEdit = (variant: Variant) => {
        setVariant(variant)
        setAddVariantForm(true)
    }
    return (
        <div className="w-full h-full relative">
            <div className="px-8 py-4">
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
                    <Image src={item?.thumbnail} alt={item?.name} width={300} height={300}
                           className="w-fit md:h-[35rem] h-[25rem] rounded-lg shadow-primary"/>
                </div>
                <div className="capitalize text-lg md:text-2xl font-medium flex flex-col gap-2">
                    <p className="uppercase line-clamp-1">ID: {item?.itemId}</p>
                    <p>Manufacture: {item?.manufacturer}</p>
                    <p>Brand: {item?.brand}</p>
                    <p>Name: {item?.name}</p>
                    <p className="text-blue-500">{item?.variants.length} Variants</p>
                    <button
                        onClick={() => setAddVariantForm(true)}
                        className="mt-5 rounded-full text-white lg:hover:bg-primary-200 transition-all bg-primary-100 p-2 flex-row flex justify-center items-center">
                        <IoAdd color="white" size={30}/>
                        <span>
                            Add Variant
                        </span>
                    </button>
                </div>
            </div>
            <div className="pt-10 px-8 py-4 font-bold text-4xl md:text-5xl">
                <h1>Variants</h1>
                <div className="w-full mt-10 flex flex-row md:gap-16 gap-10 flex-wrap justify-center items-center">
                    {item?.variants.map((variant, index) => (
                        <VariantCard item={variant} key={index} onPencil={() => onEdit(variant)}/>
                    ))}
                </div>
            </div>
            {addVariantForm &&
                <VariantForm onSubmit={onVariantFormSubmit}
                             setAddVariantForm={setAddVariantForm}
                             variant={variant}
                             deleteVariant={deleteVariant}
                             type={item.type}
                />}
        </div>
    );
};

export default Page;
