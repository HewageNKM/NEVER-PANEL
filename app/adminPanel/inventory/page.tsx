'use client';
import React, {useEffect, useState} from 'react';
import {brands} from "@/constant";
import {IoAdd, IoCloudUpload, IoEye, IoPencil, IoSearch, IoTrash} from "react-icons/io5";
import {AnimatePresence} from "framer-motion";
import AddForm from "@/app/adminPanel/inventory/components/AddForm";
import {AppDispatch} from "@/lib/store";
import {useDispatch} from "react-redux";
import {showToast} from "@/lib/toastSlice/toastSlice";
import ManageVariantsForm from "@/app/adminPanel/inventory/components/ManageVariantsForm";
import {generateId} from "@/utils/genarateIds";
import {
    deleteInventoryItem,
    filterInventoryByBrands,
    getInventory,
    saveToInventory,
    searchInventoryByPhrase, uploadImages
} from "@/firebase/serviceAPI";
import {Item, Size, Variant} from "@/interfaces";
import Loading from "@/app/adminPanel/components/Loading";

const Page = () => {
    const [loadItemTable, setLoadItemTable] = useState(true)
    const [addForm, setAddForm] = useState(false)
    const [addVariantForm, setAddVariantForm] = useState(false)
    const dispatch: AppDispatch = useDispatch();
    const [inventoryList, setInventoryList] = useState([] as Item[])
    const [refreshItemTable, setRefreshItemTable] = useState(false)
    const [search, setSearch] = useState('')

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
    const [thumbnail, setThumbnail] = useState<{file:null | File, url:string | null}>({file:null,url:null})


    // Mange Variant Form
    const [variantId, setVariantId] = useState('')
    const [variantName, setVariantName] = useState('')
    const [images, setImages] = useState([] as File[])
    const [sizes, setSizes] = useState([] as Size[])
    const [selectedItem, setSelectedItem] = useState({} as Item)

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
            if(thumbnail.file === null){
                showMessage("Please, upload a thumbnail","Warning")
                return
            }
            const genId: string = generateId("item", manufacture);
            const url = await uploadImages([thumbnail],`inventory/${genId}/`);

            const item: Item = {
                thumbnail: url[0],
                variants: [],
                type: type.toLowerCase(),
                brand: brand.toLowerCase(),
                buyingPrice: Number.parseInt(buyingPrice),
                discount: Number.parseInt(discount),
                itemId: genId.toLowerCase(),
                manufacturer: manufacture.toLowerCase(),
                name: name.toLowerCase(),
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
                name: name.toLowerCase(),
                sellingPrice: Number.parseInt(sellingPrice),
                thumbnail:i?.thumbnail || "",
                variants:i?.variants || []
            }
            // Update Item and setUpdateState to false so when add manufacture name can be edited
            await saveItem(item, "Item updated successfully")
            setUpdateState(false)
        }

    }
    const onVariantFormSubmit = async (evt: any) => {
        evt.preventDefault();

        if (images.length === 0) {
            showMessage("Please, upload at least 5 images", "Warning")
            return;
        }

        if (sizes.length === 0) {
            showMessage("Please, add the sizes", "Warning")
            return;
        }
        if(images.pop().file === ''){
            selectedItem.variants = selectedItem.variants.map((v) => v.variantId === variantId ? {
                ...v, sizes: sizes, variantName: variantName
            } : v)

            setSelectedItem(selectedItem)
            await saveItem(selectedItem,"Successfully added variant successfully")
        } else{
            const genId = generateId("variant",selectedItem.itemId);
            try {
                const imagesUrl = await uploadImages(images,`inventory/${selectedItem.itemId}/${genId}/`)
                console.log(imagesUrl)
                const variant:Variant = {
                    images: imagesUrl, sizes: sizes, variantId: genId, variantName: variantName

                }

                selectedItem.variants.push(variant)
                selectedItem.thumbnail = imagesUrl.pop() || ""
                setSelectedItem(selectedItem)
                await saveItem(selectedItem,"Successfully added variant successfully")
            }catch (e:any){
                console.log(e)
                showMessage(e.message,"Error")
            }
        }
    }
    const saveItem = async (item:Item, message:string) => {
        try {
            await saveToInventory(item);
            setAddForm(false)
            setRefreshItemTable(prevState => !prevState)
            showMessage(message, "Success")
            clearAddFormField();
            clearAddVariantFormField();
        } catch (e: any) {
            console.log(e)
            showMessage(e.message, "Error")
        }
    }

    // Delete Item
    const deleteItemFromInventory = async (id: string) => {
        const response = confirm(`Are you sure you want to delete this item with ID ${id}?`);
        if (response) {
            try {
                await deleteInventoryItem(id);
                setRefreshItemTable(prevState => !prevState)
                showMessage("Item updated successfully", "Success")
                return;
            } catch (e: any) {
                showMessage(e.message, "Error")
            }
        }
    }

    //Filter Inventory by Brands
    const filterInventory = async (brands: string) => {
        if (brands === "all") {
            setRefreshItemTable(prevState => !prevState)
        }
        try {
            const items = await filterInventoryByBrands(brands.toLowerCase())
            setInventoryList(items)
        } catch (e: any) {
            showMessage(e.message, "Error")
        }
    }

    //Search Inventory by name
    const searchInventory = async () => {

        if (search.trim().length === 0) {
            showMessage("Please, enter the search query", "Warning")
            return;
        }
        try {
            setLoadItemTable(true)
            const searchList = await searchInventoryByPhrase(search.toLowerCase());
            setInventoryList(searchList)
        } catch (e: any) {
            showMessage(e.message, "Error")
        } finally {
            setLoadItemTable(false)
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


    //Delete Variant by id
    const deleteVariant = async (variantId: string) => {
        const response = confirm(`Are you sure you want to delete this variant with ID ${variantId}?`);
        if (response) {
            try {
                selectedItem.variants = selectedItem.variants.filter(variant => variant.variantId !== variantId);
                await saveItem(selectedItem, "Successfully deleted variant")
                setSelectedItem(selectedItem)
            } catch (e: any) {
                showMessage(e.message, "Error")
            }
        }
    }
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
            file:null,
            url:null
        })
    }
    const clearAddVariantFormField = () => {
        setVariantId("")
        setVariantName("")
        setImages([])
        setSizes([])
    }
    const showMessage = (message: string, type: string) => {
        dispatch(showToast({message: message, type: type, showToast: true}))
        setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 3000);
        return;
    }

    return (
        <div className="relative w-full h-screen">
            <div className="md:pt-24 pt-32 px-4 py-4 flex flex-col relative">
                <h1 className="text-3xl font-bold">Inventory</h1>
                <div className="mt-2 flex justify-between flex-wrap gap-5 flex-row">
                    <div className="flex flex-col gap-1">
                        <label className="flex relative flex-col gap-1">
                            <span className="font-bold text-lg">Search</span>
                            <input value={search} onChange={(txt) => setSearch(txt.target.value)} type="text"
                                   placeholder="Search"
                                   className="p-1 pr-8 border-2 border-slate-300 rounded w-full md:w-[15rem]"/>
                            <button onClick={searchInventory} className="absolute top-10 right-2 "><IoSearch size={20}/>
                            </button>
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
                        <div className="w-full mt-5 flex justify-start items-start">
                            <button onClick={() => setRefreshItemTable(prevState => !prevState)}
                                    className="bg-primary-100 font-medium text-white rounded p-2">
                                Refresh
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <button onClick={() => setAddForm(true)}
                                className="bg-primary-100 text-white flex flex-row justify-center items-center h-[2.8rem] px-3 py-1 rounded hover:bg-primary-200">
                            <IoAdd size={30}/>
                            Add Item
                        </button>
                    </div>
                </div>
                {/*
                    Table for Inventory
                */}
                <div className="w-full mt-5 overflow-auto">
                    <table className="min-w-full table-auto text-left">
                        <thead>
                        <tr className="bg-slate-600 text-white">
                            <th className="p-3">Product ID</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Manufacturer</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Variations</th>
                            <th className="p-3">Buying Price(Rs)</th>
                            <th className="p-3">Selling Price(Rs)</th>
                            <th className="p-3">Discount(%)</th>
                            <th className="p-3">Profit Margin(%)</th>
                            <th className="p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {!loadItemTable && inventoryList.map((item, index) => (
                            <tr key={index}
                                className={`odd:bg-slate-200 hover:bg-white even:bg-slate-300`}>
                                <td className="p-1 font-medium uppercase">{item.itemId}</td>
                                <td className="p-1 font-medium uppercase">{item.type}</td>
                                <td className="p-1 font-medium capitalize">{item.manufacturer}</td>
                                <td className="p-1 font-medium capitalize">{item.name}</td>
                                <td className="p-1 font-medium flex flex-row flex-wrap justify-center gap-1 items-end">
                                    <p>{item.variants.length || 0}</p>
                                    <button className="text-blue-500 hover:underline"
                                            onClick={() => {
                                                setSelectedItem(item)
                                                setAddVariantForm(true)
                                            }}><IoEye size={25}/></button>
                                </td>
                                <td className="p-1 font-medium">{item.buyingPrice}</td>
                                <td className="p-1 font-medium">{item.sellingPrice}</td>
                                <td className="p-1 font-medium">{item.discount}</td>
                                <td className="p-1 font-medium">{((item.sellingPrice - item.buyingPrice) / item.buyingPrice * 100).toFixed(2)}</td>
                                <td className="p-1 font-medium flex justify-center items-center gap-2">
                                    <button onClick={() => {
                                        setType(item.type)
                                        setBrand(item.brand)
                                        setId(item.itemId)
                                        setManufacture(item.manufacturer)
                                        setName(item.name)
                                        setBuyingPrice(item.buyingPrice.toString())
                                        setSellingPrice(item.sellingPrice.toString())
                                        setDiscount(item.discount.toString())
                                        setThumbnail({
                                            file:null,
                                            url:item.thumbnail
                                        })
                                        setUpdateState(true)
                                        setAddForm(true)
                                    }} className="bg-yellow-300 text-white px-3 py-1 rounded hover:bg-yellow-400">
                                        <IoPencil size={20}/></button>
                                    <button onClick={() => deleteItemFromInventory(item.itemId)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                        <IoTrash
                                            size={20}/></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {loadItemTable && <Loading/>}
                </div>
            </div>
            <AnimatePresence>
                {addForm && (
                    <AddForm brand={brand} setBrand={setBrand}
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
                {addVariantForm &&
                    <ManageVariantsForm onSubmit={onVariantFormSubmit}
                                        setAddVariantForm={setAddVariantForm}
                                        variantName={variantName}
                                        variantId={variantId}
                                        setVariantName={setVariantName}
                                        setVariantId={setVariantId}
                                        images={images}
                                        setImages={setImages}
                                        setSizes={setSizes} sizes={sizes} selectedItem={selectedItem}
                                        deleteVariant={deleteVariant}
                    />}
            </AnimatePresence>
        </div>
    );
};

export default Page;
