"use client"
import React, {useEffect, useState} from 'react';
import ItemCard from "@/app/adminPanel/inventory/components/ItemCard";
import {AnimatePresence} from "framer-motion";
import ItemForm from "@/app/adminPanel/inventory/components/ItemForm";
import {AppDispatch, RootState} from "@/lib/store";
import {useDispatch, useSelector} from "react-redux";
import {Item} from "@/interfaces";
import {brands} from "@/constant";
import {IoAdd, IoClose} from "react-icons/io5";
import EmptyState from "@/components/EmptyState";
import InventorySearch from "@/app/adminPanel/inventory/components/InventorySearch";
import {
    deleteItemById,
    fetchInventory, setError,
    setItems,
    setPage,
    setSelectedBrand,
    setSize
} from "@/lib/inventorySlice/inventorySlice";
import DropShadow from "@/components/DropShadow";
import Loading from "@/components/Loading";

const InventoryManage = ({it}: { it: Item[] }) => {
    const dispatch: AppDispatch = useDispatch();
    const {
        page,
        size,
        selectedBrand,
        error,
        inventory,
        loading
    } = useSelector((state: RootState) => state.inventorySlice);

    const [showForm, setShowForm] = useState(false)
    const [selectedItem, setSelectedItem] = useState({} as Item)

    useEffect(() => {
        dispatch(fetchInventory({page, size}))
    }, [dispatch, selectedItem, selectedBrand, page, size])

    useEffect(() => {
        setItems(it)
    });

    const deleteItem = async (id: string) => {
        const r = confirm("Are you sure you want to delete this item?");
        if (!r) return;
        dispatch(deleteItemById({id}))
    }


    return (
        <>
            <div className="mt-2 px-4 py-4  flex justify-between flex-wrap gap-5 flex-col lg:flex-row">
                <div className="flex flex-col gap-1">
                    <label className="flex flex-col gap-1 mb-2">
                        <span className="font-medium text-lg lg:text-xl">Search</span>
                        <div className="relative">
                            <InventorySearch />
                        </div>
                    </label>
                    <label className="flex flex-col mt-2">
                        <span className="font-bold text-lg">Brands</span>
                        <select defaultValue={selectedBrand}
                                onChange={(e) => dispatch(setSelectedBrand(e.target.value))}
                                className="w-full md:w-[15rem] p-1 border-2 text-black rounded font-medium">
                            {brands.map((brand, index) => (
                                <option key={index} value={brand.value}>{brand.name}</option>
                            ))}
                            <option key={0} value="all">All</option>
                        </select>
                    </label>
                    <label className="flex flex-col">
                        <span className="font-bold text-lg">Records</span>
                        <select defaultValue={size} onChange={(e) => dispatch(setSize(parseInt(e.target.value)))}
                                className="w-full md:w-[5rem] p-1 border-2 text-black rounded font-medium">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
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
                {inventory.map((item, index) => (
                    <ItemCard item={item} key={index} onEdit={() => {
                        setSelectedItem(item)
                        setShowForm(true)
                    }} onDelete={() => deleteItem(item.itemId)}/>
                ))}
                {inventory.length === 0 && <EmptyState title={"Not Found"} subtitle={"Add Items"}/>}
            </div>
            <AnimatePresence>
                {showForm && (
                    <ItemForm selectedItem={selectedItem} setSelectedItem={setSelectedItem}
                              setShowForm={setShowForm}/>)}
            </AnimatePresence>
            <div className="flex flex-row my-5 justify-center items-center gap-5">
                <button onClick={() => dispatch(setPage(page - 1))} disabled={page === 1}
                        className="bg-primary-100 text-white px-4 py-2 rounded-lg">Prev
                </button>
                <span className="text-lg font-semibold">{page}</span>
                <button onClick={() => dispatch(setPage(page + 1))}
                        className="bg-primary-100 text-white px-4 py-2 rounded-lg">Next
                </button>
            </div>

            <AnimatePresence>
                {error && (<DropShadow>
                    <div
                        className="z-50 text-xl capitalize text-red-600 font-bold justify-center items-center flex m-5 animate-pulse p-4 rounded-lg">
                        {error}
                    </div>
                    <button onClick={()=> dispatch(setError(null))} className="text-white top-5 absolute right-5">
                        <IoClose size={30}/>
                    </button>
                </DropShadow>)}
                {loading && (<Loading />)}
            </AnimatePresence>
        </>
    );
};

export default InventoryManage;