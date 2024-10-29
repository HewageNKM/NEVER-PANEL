"use client"
import React, {useState} from 'react';
import {brands, types} from "@/constant";
import {IoClose} from "react-icons/io5";
import DropShadow from "@/components/DropShadow";
import Link from "next/link";
import {Item} from "@/interfaces";
import {generateId} from "@/utils/genarateIds";
import axios from "axios";
import {getCurrentUser} from "@/firebase/firebaseClient";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import {showToast} from "@/lib/toastSlice/toastSlice";
import Loading from "@/components/Loading";

const ItemForm = ({selectedItem, setSelectedItem, setShowForm}: {
    selectedItem: Item,
    setSelectedItem: React.Dispatch<React.SetStateAction<Item>>,
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const dispatch: AppDispatch = useDispatch();
    const [selectedThumbnail, setSelectedThumbnail] = useState(selectedItem.thumbnail)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (evt: any) => {
        try {
            evt.preventDefault();
            setLoading(true)
            const type: string = evt.target.type.value;
            const manufacturer: string = evt.target.manufacturer.value;
            const brand: string = evt.target.brand.value.toLowerCase();
            const name: string = evt.target.name.value;
            const buyingPrice: number = Number.parseInt(evt.currentTarget.buyingPrice.value);
            const sellingPrice: number = Number.parseInt(evt.target.sellingPrice.value);
            const discount: number = Number.parseInt(evt.target.discount.value);
            const itemId = selectedItem.itemId || generateId("item", manufacturer.toString().substring(0, 3)).toLowerCase()

            if(!selectedThumbnail){
                setToast("Please select a thumbnail", "Error")
                return;
            }
            const response = await uploadThumbnail(itemId);
            if (response.status != 200) {
                return;
            }
            setSelectedThumbnail(response.data)

            const newItem: Item = {
                brand,
                buyingPrice,
                discount,
                itemId,
                manufacturer,
                name,
                sellingPrice,
                thumbnail: response.data,
                type,
                variants: [],
                createdAt: null,
                updatedAt: null
            }

            const token = await getCurrentUser()?.getIdToken()
            const uid = getCurrentUser()?.uid
            const url = (selectedItem.itemId ? '/api/inventory/' + selectedItem.itemId : '/api/inventory') + "?uid=" + uid
            const method = selectedItem.itemId ? 'PUT' : 'POST'

            const res = await axios({
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                method: method,
                url: url,
                data: newItem
            });

            if (res.status !== 200) {
                console.error(res.statusText)
                setToast(res.statusText, "Error")
                return;
            }

            setSelectedItem(res.data)
            evt.target.reset()
            setSelectedThumbnail(null)
            setToast("Item saved successfully", "Success")
        } catch (error: any) {
            console.error(error)
            setToast(error.message, "Error")
        } finally {
            setLoading(false)
        }
    }

    const setThumbnail = (evt: any) => {
        if (evt.target.files) {
            setSelectedThumbnail({
                file: evt.target.files[0],
                url: URL.createObjectURL(evt.target.files[0] as Blob || '')
            })
        }
    }

    const uploadThumbnail = async (id: string) => {
        try {
            const token = await getCurrentUser()?.getIdToken()
            const uid = getCurrentUser()?.uid

            if (typeof selectedThumbnail?.file == 'string') {
                return {
                    data: {
                        url: selectedThumbnail?.url,
                        file: selectedThumbnail?.file
                    },
                    status: 200
                }

            } else {
                if (selectedItem.itemId) {
                    const axiosResponse = await axios({
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        url: `/api/storage?path=inventory/${id}/${selectedItem.thumbnail.file}&uid=${uid}`,
                    });

                    if (axiosResponse.status != 200) {
                        setToast("Error deleting old thumbnail", "Error")
                    }
                }

                const formDate = new FormData();
                formDate.set("file", selectedThumbnail?.file)
                formDate.set("path", `inventory/${id}`.toLowerCase())

                return axios({
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    },
                    url: '/api/storage?uid=' + uid,
                    data: formDate
                });
            }
        } catch (error: any) {
            console.error(error)
            return {
                status: 500
            }
        }
    }
    const setToast = (message: string, type: string) => {
        dispatch(
            showToast({
                message: message,
                type: type,
                showToast: true,
            })
        );
        setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 4000);
    };
    return (
        <DropShadow>
            <div
                className="bg-white z-50 relative overflow-x-hidden lg:w-[50vw] max-w-[95vw] flex max-h-[95vh] overflow-auto md:h-fit rounded-lg shadow-lg p-6">
                <form onSubmit={onSubmit} className="flex-col w-full flex gap-4">
                    <legend className="text-3xl font-bold mb-4 text-gray-700">
                        Item
                    </legend>

                    <div className="flex relative justify-center items-center flex-col">
                        <div
                            className="flex mt-5  relative justify-center items-center flex-col space-y-3 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm font-medium"
                            >
                                Choose Files
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                size={1}
                                name="thumbnail"
                                onChange={setThumbnail}
                                className="text-sm hidden w-fit"
                            />
                            {/* Display chosen file names */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Link href={selectedThumbnail?.url || ""} target={"_blank"}
                                      className="text-blue-500 text-center hover:border-b-blue-700 hover:text-blue-700">{typeof selectedThumbnail?.file == 'string' ? selectedThumbnail?.file : selectedThumbnail?.file?.name}</Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex w-full flex-row justify-center items-center flex-wrap gap-4">
                        <label className="flex-col hidden gap-1">
                            <span className="font-medium text-gray-700">Product ID</span>
                            <input type="text"
                                   name={"itemId"}
                                   defaultValue={selectedItem.itemId}
                                   placeholder="XXXXXX"
                                   value={selectedItem.itemId}
                                   className="p-2 border border-gray-300 rounded-lg focus:border-blue-400"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Type</span>
                            <select
                                name={"type"}
                                defaultValue={selectedItem.type} required
                                className="p-2 border border-gray-300 rounded-lg focus:border-blue-400 w-[10rem]">
                                {types.map((types, index) => (
                                    <option key={index} value={types.value}>{types.name}</option>
                                ))}
                                <option key={0} value="none">Select</option>
                            </select>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Manufacture</span>
                            <select
                                name={"manufacturer"}
                                defaultValue={selectedItem.manufacturer} required
                                className="p-2 border border-gray-300 rounded-lg focus:border-blue-400 w-[10rem]">
                                {brands.map((brand, index) => (
                                    <option key={index} value={brand.value}>{brand.name}</option>
                                ))}
                                <option key={0} value="none">Select</option>
                            </select>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Brand</span>
                            <input
                                name={"brand"}
                                required type="text"
                                defaultValue={selectedItem.brand}
                                placeholder="e.g., Jordan, Campus"
                                className="p-2 border border-gray-300 rounded-lg focus:border-blue-400"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Name</span>
                            <input
                                name={"name"}
                                required defaultValue={selectedItem.name} type="text"
                                placeholder="Nike Air Max 90"
                                className="p-2 border border-gray-300 rounded-lg focus:border-blue-400"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Buying Price (Rs)</span>
                            <input
                                name={"buyingPrice"}
                                required defaultValue={selectedItem.buyingPrice}
                                type="number" placeholder="3000"
                                className="p-2 border border-gray-300 rounded-lg focus:border-blue-400"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Selling Price (Rs)</span>
                            <input required
                                   name={"sellingPrice"}
                                   defaultValue={selectedItem.sellingPrice}
                                   type="number" placeholder="8000"
                                   className="p-2 border border-gray-300 rounded-lg focus:border-blue-400"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-gray-700">Discount (%)</span>
                            <input
                                name={"discount"}
                                required defaultValue={selectedItem.discount}
                                type="number"
                                placeholder="20"
                                className="p-2 border border-gray-300 rounded-lg focus:border-blue-400"/>
                        </label>
                    </div>
                    <div className="w-full flex justify-center mt-4">
                        <button
                            className="bg-primary-100 text-white font-medium rounded-lg px-6 py-2 transition hover:bg-primary-200 focus:outline-none">
                            Save
                        </button>
                    </div>
                </form>
                <div className="absolute top-4 right-4">
                    <button onClick={() => {
                        setSelectedItem({} as Item)
                        setShowForm(false)
                    }} className="p-1 rounded-full hover:bg-gray-100">
                        <IoClose size={24} color="gray"/>
                    </button>
                </div>
            </div>
            {loading && (<Loading />)}
        </DropShadow>
    );
};

export default ItemForm;
