"use client"
import React, {useEffect, useState} from 'react';
import ItemCard from "@/app/adminPanel/inventory/components/ItemCard";
import {AnimatePresence} from "framer-motion";
import ItemForm from "@/app/adminPanel/inventory/components/ItemForm";
import {AppDispatch} from "@/lib/store";
import {useDispatch} from "react-redux";
import {Item} from "@/interfaces";
import {brands} from "@/constant";
import {IoAdd, IoSearch} from "react-icons/io5";
import EmptyState from "@/components/EmptyState";
import axios from "axios";
import {getCurrentUser} from "@/firebase/firebaseClient";

const InventoryManage = ({it}: { it: Item[] }) => {
    const dispatch: AppDispatch = useDispatch();

    const [page, setPage] = useState(1)
    const [size, setSize] = useState(20)

    const [showForm, setShowForm] = useState(false)
    const [items, setItems] = useState(it)

    const [selectedItem, setSelectedItem] = useState({} as Item)

    useEffect(() => {
        fetchItems()
    }, [dispatch, selectedItem])

    const fetchItems = async () => {
        const uid = getCurrentUser()?.uid;
        const token = await getCurrentUser()?.getIdToken()

        console.log("Fetching")
        const res = await axios({
            method: 'GET',
            url: `/api/inventory?page=${page}&size=${size}&uid=${uid}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setItems(res.data)
    }

    return (
        <>
            <div className="mt-2 px-4 py-4  flex justify-between flex-wrap gap-5 flex-col lg:flex-row">
                <div className="flex flex-col gap-1">
                    <label className="flex flex-col gap-1 mb-2">
                        <span className="font-medium text-lg lg:text-xl">Search</span>
                        <div className="relative">
                            <input
                                type="text"
                                className="px-4 py-2 lg:w-[16rem] focus:outline-none bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-500 transition duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Search"
                            />
                            <button className="absolute top-1/2 transform -translate-y-1/2 right-3">
                                <IoSearch className="text-gray-500 hover:text-blue-500 transition duration-200"/>
                            </button>
                        </div>
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
                    <button onClick={() => setShowForm(true)}
                            className="bg-primary-100 text-white flex flex-row justify-center items-center h-[2.8rem] px-3 py-1 rounded hover:bg-primary-200">
                        <IoAdd size={30}/>
                        Add Item
                    </button>
                </div>
            </div>
            <div className="w-full my-10 flex flex-row flex-wrap gap-10 lg:gap-20 justify-center items-center">
                {items.map((item, index) => (
                    <ItemCard item={item} key={index} onEdit={() => {
                        setSelectedItem(item)
                        setShowForm(true)
                    }} onDelete={() => {
                    }}/>
                ))}
                {items.length === 0 && <EmptyState title={"Not Found"} subtitle={"Add Items"}/>}
            </div>
            <AnimatePresence>
                {showForm && (
                    <ItemForm selectedItem={selectedItem} setSelectedItem={setSelectedItem}
                              setShowForm={setShowForm}/>)}
            </AnimatePresence>
        </>
    );
};

export default InventoryManage;