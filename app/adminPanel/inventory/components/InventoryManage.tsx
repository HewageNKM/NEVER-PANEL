"use client"
import React, {useEffect, useState} from 'react';
import ItemCard from "@/app/adminPanel/inventory/components/ItemCard";
import Loading from "@/app/adminPanel/components/Loading";
import {AnimatePresence} from "framer-motion";
import ItemForm from "@/app/adminPanel/inventory/components/ItemForm";
import {AppDispatch} from "@/lib/store";
import {useDispatch} from "react-redux";
import {Item} from "@/interfaces";
import {generateId} from "@/utils/genarateIds";
import {
    deleteFilesFromStorage,
    deleteInventoryItem,
    filterInventoryByBrands, getInventory,
    saveToInventory,
    uploadImages
} from "@/firebase/firebaseClient";
import {hideLoader, showLoader} from "@/lib/pageLoaderSlice/pageLoaderSlice";
import {showToast} from "@/lib/toastSlice/toastSlice";
import {brands} from "@/constant";
import {IoAdd, IoSearch} from "react-icons/io5";
import EmptyState from "@/components/EmptyState";

const InventoryManage = () => {
    const [loadItemTable, setLoadItemTable] = useState(true)
    const [addForm, setAddForm] = useState(false)
    const dispatch: AppDispatch = useDispatch();
    const [inventoryList, setInventoryList] = useState([] as Item[])
    const [refreshItemTable, setRefreshItemTable] = useState(false)

    // Add Item Form
    const [id, setId] = useState('');
    const [manufacture, setManufacture] = useState('none')
    const [name, setName] = useState('')
    const [buyingPrice, setBuyingPrice] = useState("")
    const [sellingPrice, setSellingPrice] = useState("")
    const [discount, setDiscount] = useState("")
    const [updateState, setUpdateState] = useState(false)
    const [type, setType] = useState("none")
    const [brand, setBrand] = useState("")
    const [thumbnail, setThumbnail] = useState<{ file: null | File, url: string | null }>({file: null, url: null})

    const onAddItemFormSubmit = async (evt: any) => {
        evt.preventDefault();

        if (manufacture === "none") {
            showMessage("Please, select the manufacture", "Warning")
            return;
        }

        if (type === "none") {
            showMessage("Please, select the type", "Warning")
            return;
        }

        if (id.trim().length === 0) {
            if (thumbnail.file === null) {
                showMessage("Please, upload a thumbnail", "Warning")
                return
            }
            const genId: string = generateId("item", manufacture);
            const url = await uploadImages([thumbnail], `inventory/${genId.toLowerCase()}/`);

            const item: Item = {
                thumbnail: url[0],
                variants: [],
                type: type.toLowerCase(),
                brand: brand.toLowerCase(),
                buyingPrice: Number.parseInt(buyingPrice),
                discount: Number.parseInt(discount),
                itemId: genId.toLowerCase(),
                manufacturer: manufacture.toLowerCase(),
                name: name,
                sellingPrice: Number.parseInt(sellingPrice)
            }

            await saveItem(item, "Item added successfully")

        } else if (id.trim().length > 0) {
            const i = inventoryList.find((item) => item.itemId === id);

            const item: Item = {
                brand: brand.toLowerCase(),
                type: type.toLowerCase(),
                buyingPrice: Number.parseInt(buyingPrice),
                discount: Number.parseInt(discount),
                itemId: id.toLowerCase(),
                manufacturer: manufacture.toLowerCase(),
                name: name,
                sellingPrice: Number.parseInt(sellingPrice),
                thumbnail: i?.thumbnail || "",
                variants: i?.variants || []
            }
            // Update Item and setUpdateState to false so when add manufacture name can be edited
            await saveItem(item, "Item updated successfully")
            setUpdateState(false)
        }

    }
    const saveItem = async (item: Item, message: string) => {
        try {
            dispatch(showLoader())
            await saveToInventory(item);
            setAddForm(false)
            setRefreshItemTable(prevState => !prevState)
            showMessage(message, "Success")
            clearAddFormField();
        } catch (e: any) {
            console.log(e)
            showMessage(e.message, "Error")
        } finally {
            dispatch(hideLoader())
        }
    }

    // Delete Item
    const deleteItemFromInventory = async (id: string) => {
        const response = confirm(`Are you sure you want to delete this item with ID ${id}?`);
        if (response) {
            try {
                await deleteFilesFromStorage(`inventory/${id}`)
                await deleteInventoryItem(id);
                setRefreshItemTable(prevState => !prevState)
                showMessage("Item updated successfully", "Success")
                return;
            } catch (e: any) {
                showMessage(e.message, "Error")
            }
        }
    }

    //Filter InventoryManage by Brands
    const filterInventory = async (brands: string) => {
        if (brands === "all") {
            setRefreshItemTable(prevState => !prevState)
        }
        try {
            const items = await filterInventoryByBrands(brands)
            setInventoryList(items)
        } catch (e: any) {
            showMessage(e.message, "Error")
        }
    }

    useEffect(() => {
        setLoadItemTable(true)
        getInventory().then((items) => {
            setInventoryList(items)
        }).catch((e) => {
            showMessage(e.message, "Error")
        }).finally(() => setLoadItemTable(false))
    }, [refreshItemTable, dispatch])

    const clearAddFormField = () => {
        setManufacture("none")
        setName("")
        setBuyingPrice("")
        setSellingPrice("")
        setDiscount("")
        setId("")
        setBrand("")
        setType("none")
        setThumbnail({
            file: null,
            url: null
        })
    }

    const showMessage = (message: string, type: string) => {
        dispatch(showToast({message: message, type: type, showToast: true}))
        setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 3000);
        return;
    }
    return (
        <>
            <div className="mt-2 flex justify-between flex-wrap gap-5 flex-col lg:flex-row">
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
                                onChange={(txt) => filterInventory(txt.target.value)}
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
            <div className="w-full mt-10 flex flex-row flex-wrap gap-10 lg:gap-20 justify-center items-center">
                {!loadItemTable && inventoryList.map((item, index) => (
                    <ItemCard item={item} key={index} onEdit={() => {
                        setType(item.type)
                        setBrand(item.brand)
                        setId(item.itemId)
                        setManufacture(item.manufacturer)
                        setName(item.name)
                        setBuyingPrice(item.buyingPrice.toString())
                        setSellingPrice(item.sellingPrice.toString())
                        setDiscount(item.discount.toString())
                        setThumbnail({
                            file: null,
                            url: item.thumbnail
                        })
                        setUpdateState(true)
                        setAddForm(true)
                    }} onDelete={() => deleteItemFromInventory(item.itemId)}/>
                ))}
                {loadItemTable && <Loading/>}
                {inventoryList.length === 0 && <EmptyState title={"Not Found"} subtitle={"Add Items"}/>}
            </div>
            <AnimatePresence>
                {addForm && (
                    <ItemForm brand={brand} setBrand={setBrand}
                              updateState={updateState}
                              setUpdateState={setUpdateState}
                              discount={discount}
                              sellingPrice={sellingPrice}
                              buyingPrice={buyingPrice}
                              name={name}
                              manufacture={manufacture}
                              setAddForm={setAddForm}
                              setDiscount={setDiscount}
                              setBuyingPrice={setBuyingPrice}
                              setName={setName}
                              setManufacture={setManufacture}
                              setSellingPrice={setSellingPrice}
                              id={id} setId={setId}
                              setThumbnail={setThumbnail}
                              thumbnail={thumbnail}
                              onSubmit={onAddItemFormSubmit} setType={setType} type={type}/>)}
            </AnimatePresence>
        </>
    );
};

export default InventoryManage;