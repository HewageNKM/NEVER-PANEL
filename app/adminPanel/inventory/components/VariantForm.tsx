import React, {useState} from 'react';
import DropShadow from "@/components/DropShadow";
import {IoAdd, IoClose, IoCloudUpload, IoPencil} from "react-icons/io5";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import {showToast} from "@/lib/toastSlice/toastSlice";
import {Item, Variant} from "@/interfaces";
import {accessoriesSizesList, shoeSizesList} from "@/constant";
import {saveToInventory, uploadImages} from "@/firebase/serviceAPI";
import {generateId} from "@/utils/genarateIds";
import {hideLoader, showLoader} from "@/lib/pageLoaderSlice/pageLoaderSlice";

const VariantForm = ({
                         setAddVariantForm,
                         variant,
                         type,
                         setVariant,
                         item,
                         setItem

                     }: {
    setAddVariantForm: React.Dispatch<React.SetStateAction<boolean>>,
    variant: Variant,
    setVariant: any
    type: string,
    item: Item,
    setItem: any
}) => {
    const [file, setFile] = React.useState<string | undefined>("");
    const [selectedSize, setSelectedSize] = useState("none")
    const [stock, setStock] = useState(0)

    const [sizes, setSizes] = useState(variant?.sizes || []);
    const [images, setImages] = useState(variant?.images || []);
    const [variantId, setVariantId] = useState(variant?.variantId || "");
    const [variantName, setVariantName] = useState(variant?.variantName || "");

    const dispatch: AppDispatch = useDispatch();
    const handleFileSelect = (evt: any) => {
        if (evt.target.files[0].size >= 10000000) {
            showDisplayMessage("Warning", "File size is too large")
            return;
        }

        if (images.length >= 5) {
            showDisplayMessage("Warning", "You can only add 5 images")
            setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 3000);
            return;
        }

        if (evt.target.files[0]) {
            setImages(prevState => [...prevState, {
                file: evt.target.files[0],
                url: URL.createObjectURL(evt.target.files[0])
            }])
        }
        setFile("")
    }
    const onVariantFormSubmit = async (evt: any) => {
        evt.preventDefault();

        if (variantName === "") {
            showDisplayMessage("Warning", "Please enter a variant name")
            return;
        }

        if (images.length === 0) {
            showDisplayMessage("Warning", "Please add at least one image")
            return;
        }

        if (sizes.length === 0) {
            showDisplayMessage("Warning", "Please add at least one size")
            return;
        }

        dispatch(showLoader())
        if (variant == null) {
            try {
                const id = generateId("variant", "").toLowerCase();
                const uploadedImagesUrls = await uploadImages(images, `inventory/${item.itemId}/${id}`);
                const newVariant: Variant = {
                    variantId: id,
                    variantName: variantName.toLowerCase(),
                    images: uploadedImagesUrls,
                    sizes: sizes
                }
                item.variants.push(newVariant)
                setItem(item)
                await saveItem("Variant added successfully")
            } catch (e: any) {
                showDisplayMessage("Error", e.message)
            } finally {
                dispatch(hideLoader())
            }
        } else {
            try {
                variant.variantName = variantName.toLowerCase()
                variant.sizes = sizes
                setVariant(variant)
                const filter = item.variants.filter(v => v.variantId !== variant.variantId);
                filter.push(variant)
                item.variants = filter
                setItem(item)
                await saveItem("Variant updated successfully")
            } catch (e: any) {
                showDisplayMessage("Error", e.message)
            } finally {
                dispatch(hideLoader())
            }
        }

        setVariant(null)
        setAddVariantForm(false)
    }

    const saveItem = async (msg:string) => {
        await saveToInventory(item)
        showDisplayMessage("Success", msg)
    }

    const addSizeToTable = () => {
        if (selectedSize === "none") {
            dispatch(showToast({
                message: "Please select a size",
                type: "Warning",
                showToast: true
            }))
            setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 3000);
            return;
        }

        if (stock <= 0) {
            dispatch(showToast({
                message: "Please enter a valid stock",
                type: "Warning",
                showToast: true
            }))
            setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 3000);
            return;
        }

        const size = {
            size: selectedSize,
            stock: stock
        }

        if (sizes.length > 0) {
            const index = sizes.findIndex((s: any) => s.size === selectedSize)
            if (index !== -1) {
                sizes[index] = {
                    ...sizes[index],
                    stock: sizes[index].stock = stock
                }
            } else {
                setSizes(prevState => [...prevState, size])
            }
        } else {
            setSizes(prevState => [...prevState, size])
        }

        setSelectedSize("none")
        setStock(0)
    }

    const showDisplayMessage = (type: string, message: string) => {
        dispatch(showToast({
            message: message,
            type: type,
            showToast: true
        }))
        setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 3000);
    }
    return (
        <DropShadow>
            <div
                className="bg-white z-50 md:w-fit w-[95vw] flex md:h-fit h-[80vh] justify-center items-center overflow-auto rounded p-4 relative">
                <form onSubmit={onVariantFormSubmit} className="flex-col flex gap-5">
                    <legend className="text-2xl font-bold">
                        Variant
                    </legend>
                    <div className="mt-2 flex flex-col justify-center items-start flex-wrap gap-5">
                        {images.length > 0 && <h2 className="text-lg font-bold">Images</h2>}
                        <div className="gap-5 flex-row w-full flex-wrap flex justify-center items-center">
                            {images.map((image, index) => (
                                <div key={index} className="flex gap-2 flex-row justify-center items-center">
                                    <p className="lg:hover:border-b-2 h-6 lg:border-b-black transition-all">
                                        {`Image ${index + 1}`}
                                    </p>
                                    <button className="bg-black rounded-full cursor-pointer" disabled={variant != null}
                                            onClick={() => {
                                                setImages(prevState => prevState.filter((img, i) => i !== index))
                                            }}>
                                        <IoClose size={20} color="white"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-5 flex flex-row justify-center items-center flex-wrap gap-5">
                        <label className="flex-col hidden gap-1">
                            <span className="font-medium">Variant ID</span>
                            <input onChange={(txt) => setVariantId(txt.target.value)} value={variantId} type="text"
                                   placeholder="XXXXXXXXXX"
                                   className={`p-1 border-2 border-slate-300 rounded bg-primary-200`}/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium">Variant Name </span>
                            <input onChange={(txt) => setVariantName(txt.target.value)} value={variantName} required
                                   type="text"
                                   placeholder="Variant 1"
                                   className="p-1 text-center capitalize border-2 border-slate-300 rounded"/>
                        </label>
                        <label className="flex-col flex justify-center items-center gap-1">
                            <div className="flex  relative justify-center items-center flex-col">
                                <IoCloudUpload size={30}/>
                                <input disabled={variant != null} value={file}
                                       onChange={(file) => handleFileSelect(file)}
                                       type="file" multiple
                                       accept="image/*"
                                       className="absolute w-[5rem] opacity-0 bg-black"/>
                            </div>
                            <span className="font-medium"> Upload Images(5 Max)</span>
                        </label>
                    </div>
                    <div>
                        <div className="flex flex-row gap-1 items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                Sizes
                            </h2>
                        </div>
                        <div className="flex flex-row justify-between gap-5 items-center">
                            <label className="flex flex-col gap-1">
                                <span>Size</span>
                                <select
                                    onChange={(txt) => setSelectedSize(txt.target.value)}
                                    defaultValue={selectedSize}
                                    value={selectedSize}
                                    className="p-1 text-center  w-fit lg:w-[10vw] border-2 border-slate-300 rounded"
                                >
                                    <option value="none">
                                        Select
                                    </option>
                                    {type == "shoe" || type == "slipper" ? shoeSizesList.map((size, index) => (
                                        <option key={index}
                                                value={size}>{size}</option>)) : accessoriesSizesList.map((size, index) => (
                                        <option key={index} value={size.value}>{size.name}</option>))}</select>
                            </label>
                            <label className="flex flex-col gap-1">
                                <span>Stock</span>
                                <input value={stock} onChange={(txt) => setStock(Number.parseInt(txt.target.value))}
                                       type="number"
                                       className="p-1 text-center w-[15vw] lg:w-[10vw] border-2 border-slate-300 rounded"/>
                            </label>
                            <div className="flex pt-7 items-center justify-center">
                                <button onClick={() => addSizeToTable()} type="button"
                                        className="flex px-2 md:text-lg text-[.9rem] bg-primary-100 p-1 rounded text-white font-medium flex-row items-center">
                                    Add/Update Size
                                </button>
                            </div>
                        </div>
                        <div className="mt-2 overflow-auto">
                            <table className="min-w-full table-auto text-center">
                                <thead>
                                <tr className="bg-slate-600 text-white">
                                    <th className="px-2">Size</th>
                                    <th className="px-2">Stock</th>
                                    <th className="px-2">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sizes.map((size, index) => (
                                    <tr key={index}
                                        className="odd:bg-slate-200 md:text-lg text-sm hover:bg-white even:bg-slate-300"
                                    >
                                        <td className="px-2">{size.size}</td>
                                        <td className="px-2">{size.stock}</td>
                                        <td className="px-2 flex flex-row gap-1 justify-end">
                                            <button onClick={() => {
                                                setSelectedSize(size.size)
                                                setStock(size.stock)
                                            }} type="button" className="p-1 bg-yellow-300 rounded-lg">
                                                <IoPencil size={15}/>
                                            </button>
                                            <button
                                                className="p-1 bg-red-500  rounded-lg"
                                                onClick={() => {
                                                    setSizes(prevState => prevState.filter((s, i) => i !== index))
                                                }}>
                                                <IoClose size={15}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='w-full mt-5 flex justify-center'>
                        <button type="submit"
                                className="bg-primary-100 md:text-lg text-[.9rem] text-white flex flex-row justify-center items-center h-[2.8rem] px-3 py-1 rounded hover:bg-primary-200">
                            <IoAdd size={30}/>
                            Add Variant
                        </button>
                    </div>
                </form>
                <div className="absolute top-1 right-1">
                    <button onClick={() => {
                        setAddVariantForm(false)
                        setVariantName('')
                        setVariantId('')
                        setImages([])
                        setFile("")
                        setSizes([])
                        setSelectedSize("none")
                        setStock(0)
                        setVariant(null)
                    }}>
                        <IoClose size={30}/>
                    </button>
                </div>
            </div>
        </DropShadow>
    );
};

export default VariantForm;
