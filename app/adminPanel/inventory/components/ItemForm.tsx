"use client"
import React from 'react';
import {brands, types} from "@/constant";
import {IoClose, IoCloudUpload} from "react-icons/io5";
import DropShadow from "@/components/DropShadow";
import {showToast} from "@/lib/toastSlice/toastSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import Link from "next/link";

const ItemForm = ({
                      onSubmit,
                      setAddForm,
                      id,
                      setId,
                      manufacture,
                      setManufacture,
                      setName,
                      name,
                      setBuyingPrice,
                      buyingPrice,
                      setSellingPrice,
                      sellingPrice,
                      setDiscount,
                      discount,
                      setUpdateState,
                      updateState,
                      type,
                      setType,
                      brand,
                      setBrand,
                      thumbnail,
                      setThumbnail
                  }: {
    id: string,
    discount: number,
    sellingPrice: number,
    buyingPrice: number,
    name: string,
    manufacture: string,
    setId: React.Dispatch<React.SetStateAction<string>>,
    setAddForm: React.Dispatch<React.SetStateAction<boolean>>,
    setDiscount: React.Dispatch<React.SetStateAction<string>>,
    setSellingPrice: React.Dispatch<React.SetStateAction<string>>,
    setBuyingPrice: React.Dispatch<React.SetStateAction<string>>,
    setName: React.Dispatch<React.SetStateAction<string>>,
    setManufacture: React.Dispatch<React.SetStateAction<string>>,
    onSubmit: (evt: any) => void,
    updateState: boolean,
    setUpdateState: React.Dispatch<React.SetStateAction<boolean>>,
    type: string,
    setType: React.Dispatch<React.SetStateAction<string>>,
    brand: string,
    setBrand: React.Dispatch<React.SetStateAction<string>>,
    setThumbnail: React.Dispatch<React.SetStateAction<object>>,
    thumbnail: object
}) => {
    const dispatch: AppDispatch = useDispatch();

    const handleFile = (evt: any) => {
        if (evt.target.files[0]?.size >= 10000000) {
            dispatch(showToast({
                message: "File size is larger than 10MB",
                type: "Error",
                showToast: true
            }))
            setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 3000);
            return;
        }
        if(evt.target.files[0]){
            setThumbnail({
                file: evt.target.files[0],
                url: URL.createObjectURL(evt.target.files[0])
            })
        }
    }

    return (
        <DropShadow>
            <div className="bg-white z-50 lg:w-[50vw] max-w-[95vw] flex max-h-[95vh] overflow-auto md:h-fit rounded-lg shadow-lg p-6 relative">
                <form onSubmit={onSubmit} className="flex-col w-full flex gap-4">
                    <legend className="text-3xl font-bold mb-4 text-gray-700">
                        Item
                    </legend>

                    <div className="flex relative justify-center items-center flex-col">
                        {thumbnail.url &&
                            <div className="flex flex-row gap-2 items-center">
                                <Link target="_blank" href={thumbnail.url} className="text-blue-500 hover:underline">Thumbnail</Link>
                                <button disabled={updateState} className="p-2 rounded-full hover:bg-gray-200" onClick={() => setThumbnail({file: null, url: null})}>
                                    <IoClose size={20} color="gray"/>
                                </button>
                            </div>
                        }

                        <div className="flex mt-5 relative justify-center items-center flex-col">
                            <IoCloudUpload size={40} color="gray" />
                            <p className="text-gray-500 mt-2">Upload Image</p>
                            <input disabled={updateState}
                                   type="file" multiple
                                   accept=".jpeg, .jpg, .png"
                                   onChange={(file) => handleFile(file)}
                                   className="absolute w-full h-full opacity-0 cursor-pointer"/>
                        </div>
                    </div>
                    <div className="mt-5 flex w-full flex-row justify-center items-center flex-wrap gap-4">
                        <label className="flex-col hidden gap-1">
                            <span className="font-medium text-gray-700">Product ID</span>
                            <input type="text"
                                   value={id}
                                   onChange={(txt) => setId(txt.target.value)}
                                   placeholder="e.g., Jordan, Campus"
                                   className="p-2 border border-gray-300 rounded-lg focus:border-blue-400"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Type</span>
                            <select disabled={updateState} required value={type}
                                    onChange={(txt) => setType(txt.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg focus:border-blue-400 w-[10rem]">
                                {types.map((types, index) => (
                                    <option key={index} value={types.value}>{types.name}</option>
                                ))}
                                <option key={0} value="none">Select</option>
                            </select>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Manufacture</span>
                            <select disabled={updateState} required value={manufacture}
                                    onChange={(txt) => setManufacture(txt.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg focus:border-blue-400 w-[10rem]">
                                {brands.map((brand, index) => (
                                    <option key={index} value={brand.value}>{brand.name}</option>
                                ))}
                                <option key={0} value="none">Select</option>
                            </select>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Brand</span>
                            <input required type="text"
                                   value={brand}
                                   onChange={(txt) => setBrand(txt.target.value)}
                                   placeholder="e.g., Jordan, Campus"
                                   className="p-2 border border-gray-300 rounded-lg focus:border-blue-400"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Name</span>
                            <input required value={name} onChange={(txt) => setName(txt.target.value)} type="text"
                                   placeholder="Nike Air Max 90"
                                   className="p-2 border border-gray-300 rounded-lg focus:border-blue-400"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Buying Price (Rs)</span>
                            <input required value={buyingPrice} onChange={(txt) => setBuyingPrice(txt.target.value)}
                                   type="number" placeholder="3000"
                                   className="p-2 border border-gray-300 rounded-lg focus:border-blue-400"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Selling Price (Rs)</span>
                            <input required value={sellingPrice} onChange={(txt) => setSellingPrice(txt.target.value)}
                                   type="number" placeholder="8000"
                                   className="p-2 border border-gray-300 rounded-lg focus:border-blue-400"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Discount (%)</span>
                            <input required value={discount} onChange={(txt) => setDiscount(txt.target.value)}
                                   type="number"
                                   placeholder="20"
                                   className="p-2 border border-gray-300 rounded-lg focus:border-blue-400"/>
                        </label>
                    </div>
                    <div className="w-full flex justify-center mt-4">
                        <button
                            className="bg-primary-100 text-white font-medium rounded-lg px-6 py-2 transition hover:bg-primary-200 focus:outline-none">
                            {updateState ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
                <div className="absolute top-4 right-4">
                    <button onClick={() => {
                        setId('')
                        setManufacture('none')
                        setName('')
                        setBuyingPrice("")
                        setSellingPrice("")
                        setDiscount("")
                        setType("none")
                        setBrand('')
                        setThumbnail({file: null, url: null})
                        setAddForm(false)
                        setUpdateState(false)
                    }} className="p-1 rounded-full hover:bg-gray-100">
                        <IoClose size={24} color="gray"/>
                    </button>
                </div>
            </div>
        </DropShadow>
    );
};

export default ItemForm;
