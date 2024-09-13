'use client';
import React, {useState} from 'react';
import {brands} from "@/constant";
import {IoAdd, IoEye, IoPencil, IoSearch, IoTrash} from "react-icons/io5";
import {AnimatePresence} from "framer-motion";
import AddForm from "@/app/adminPanel/inventory/components/AddForm";
import {AppDispatch} from "@/lib/store";
import {useDispatch} from "react-redux";
import {showToast} from "@/lib/toastSlice/toastSlice";
import AddVariantForm from "@/app/adminPanel/inventory/components/AddVariantForm";

const Page = () => {
    const [addForm, setAddForm] = useState(false)
    const [addVariantForm, setAddVariantForm] = useState(false)
    const dispatch:AppDispatch = useDispatch();

    // Add Item Form
    const [id, setId] = useState('');
    const [manufacture, setManufacture] = useState('none')
    const [name, setName] = useState('')
    const [buyingPrice, setBuyingPrice] = useState("")
    const [sellingPrice, setSellingPrice] = useState("")
    const [discount, setDiscount] = useState("")

    // Add Variant Form
    const [variantId, setVariantId] = useState('')
    const [colorCode, setColorCode] = useState('')
    const [images, setImages] = useState([])


    const onSubmit = (evt: any) => {
        evt.preventDefault();

        if(manufacture === "none"){
            dispatch(showToast({
                message: "Please select a manufacture",
                type: "Error",
                showToast: true
            }))
            setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 3000);
            return;
        }
    }
    return (
        <div className="relative w-full h-screen">
            <div className="md:pt-24 pt-32 px-4 py-4 flex flex-col relative">
                <h1 className="text-3xl font-bold">Inventory</h1>
                <div className="mt-2 flex justify-between flex-wrap gap-5 flex-row">
                    <div className="flex flex-col gap-1">
                        <label className="flex relative flex-col gap-1">
                            <span className="font-bold text-lg">Search</span>
                            <input type="text" placeholder="Search"
                                   className="p-1 pr-8 border-2 border-slate-300 rounded w-full md:w-[15rem]"/>
                            <button className="absolute top-10 right-2 "><IoSearch size={20}/></button>
                        </label>
                        <label className="flex flex-col mt-2">
                            <span className="font-bold text-lg">Brands</span>
                            <select defaultValue="all"
                                    className="w-full md:w-[15rem] p-1 border-2 text-black rounded font-medium">
                                {brands.map((brand, index) => (
                                    <option key={index} value={brand.value}>{brand.name}</option>
                                ))}
                                <option key={0} value="all">All</option>
                            </select>
                        </label>
                    </div>
                    <div className="flex justify-center items-center">
                        <button onClick={() => setAddForm(true)}
                                className="bg-primary-100 text-white flex flex-row justify-center items-center h-[2.8rem] px-3 py-1 rounded hover:bg-primary-200">
                            <IoAdd size={30}/>
                            Add Item
                        </button>
                    </div>
                </div>
                <div className="w-full mt-5 overflow-auto">
                    <table className="min-w-full table-auto text-left">
                        <thead>
                        <tr className="bg-slate-600 text-white">
                            <th className="p-3">Product ID</th>
                            <th className="p-3">Manufacturer</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Variations</th>
                            <th className="p-3">Buying Price(Rs)</th>
                            <th className="p-3">Selling Price(Rs)</th>
                            <th className="p-3">Profit Margin(%)</th>
                            <th className="p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="odd:bg-slate-200 hover:bg-white even:bg-slate-300">
                            <td className="p-1 font-medium">1</td>
                            <td className="p-1 font-medium">Adidas</td>
                            <td className="p-1 font-medium">Yeezy</td>
                            <td className="p-1 font-medium flex flex-row flex-wrap gap-2 justify-start items-center">
                                <p>10</p>
                                <button className="text-blue-500 hover:underline"><IoEye size={25}/></button>
                                <button className="text-blue-500 hover:underline" onClick={()=> setAddVariantForm(true)}><IoAdd size={25}/></button>
                            </td>
                            <td className="p-1 font-medium">$200</td>
                            <td className="p-1 font-medium">$300</td>
                            <td className="p-1 font-medium">50%</td>
                            <td className="p-1 font-medium flex gap-2">
                                <button className="bg-yellow-300 text-white px-3 py-1 rounded hover:bg-yellow-400">
                                    <IoPencil size={20}/></button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"><IoTrash
                                    size={20}/></button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <AnimatePresence>
                {addForm && (
                    <AddForm discount={discount} sellingPrice={sellingPrice} buyingPrice={buyingPrice} name={name}
                             manufacture={manufacture} setAddForm={setAddForm} setDiscount={setDiscount}
                             setBuyingPrice={setBuyingPrice} setName={setName} setManufacture={setManufacture}
                             setSellingPrice={setSellingPrice}
                             id={id} setId={setId}
                     onSubmit={onSubmit}/>)}
                {addVariantForm && <AddVariantForm setAddVariantForm={setAddVariantForm} colorCode={colorCode} variantId={variantId} setColorCode={setColorCode} setVariantId={setVariantId} images={images} setImages={setImages}/>}
            </AnimatePresence>
        </div>
    );
};

export default Page;
