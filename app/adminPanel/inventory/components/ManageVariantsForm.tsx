import React, {useState} from 'react';
import DropShadow from "@/components/DropShadow";
import {IoAdd, IoClose, IoCloudUpload, IoPencil} from "react-icons/io5";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import {showToast} from "@/lib/toastSlice/toastSlice";
import Image from "next/image";
import {shoeSizesList} from "@/constant";
import {Size} from "@/interfaces";

const ManageVariantsForm = ({
                            setVariantId,
                            setImages,
                            variantId,
                            setAddVariantForm,
                            colorCode,
                            setColorCode,
                            images,
                            selectedThumbnail,
                            setSelectedThumbnail,
                            setSizes,
                            sizes
                        }: {
    variantId: string,
    colorCode: string,
    setVariantId: React.Dispatch<React.SetStateAction<string>>,
    setColorCode: React.Dispatch<React.SetStateAction<string>>,
    setAddVariantForm: React.Dispatch<React.SetStateAction<boolean>>,
    images: object[],
    setImages: React.Dispatch<React.SetStateAction<object[]>>,
    selectedThumbnail: object,
    setSelectedThumbnail: React.Dispatch<React.SetStateAction<object>>,
    setSizes: React.Dispatch<React.SetStateAction<Size[]>>
    sizes: Size[]
}) => {
    const [file, setFile] = React.useState<string | undefined>("");
    const [selectedSize, setSelectedSize] = useState("none")
    const [stock, setStock] = useState(0)

    const dispatch: AppDispatch = useDispatch();
    const handleFileSelect = (evt: any) => {
        if (evt.target.files[0].size >= 10000000) {
            dispatch(showToast({
                message: "File size is larger than 10MB",
                type: "Error",
                showToast: true
            }))
            setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 3000);
            return;
        }

        if (images.length >= 5) {
            dispatch(showToast({
                message: "You can only upload 5 images",
                type: "Error",
                showToast: true
            }))
            setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 3000);
            return;
        }
        setImages(prevState => [...prevState, {
            file: evt.target.files[0],
            url: URL.createObjectURL(evt.target.files[0])
        }])
        setFile("")
    }

    const addSizeToTable = () => {
        console.log(selectedSize)
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
            const index = sizes.findIndex((size: any) => size.size === selectedSize)
            if (index !== -1) {
                sizes[index] = size
            } else {
                setSizes(prevState => [...prevState, size])
            }
        } else {
            setSizes(prevState => [...prevState, size])
        }
        setSelectedSize("none")
        setStock( 0)
    }

    return (
        <DropShadow>
            <div className="bg-white z-50 max-w-[90vw] flex h-fit rounded p-4 relative">
                <form className="flex-col flex gap-5">
                    <legend className="text-2xl font-bold">
                        Manage Variants
                    </legend>
                    <div className="mt-2 flex flex-col justify-center items-start flex-wrap gap-5">
                        {images.length > 0 && <h2 className="text-lg font-bold">Select Thumbnail</h2>}
                        <div className="gap-5 flex-row w-full flex justify-center items-center flex-wrap">
                            {images.map((image, index) => (
                                <div key={index} className="relative">
                                    <Image onClick={() => {
                                        setSelectedThumbnail(image)
                                    }} width={20} height={20} src={image.url} alt="variant"
                                           className={`w-20 h-20 rounded object-cover ${selectedThumbnail.url == image.url && "border-primary-100 border-4"}`}/>
                                    <button className="absolute top-0 right-0" onClick={() => {
                                        setImages(prevState => prevState.filter((img, i) => i !== index))
                                    }}>
                                        <IoClose size={20}/>
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
                            <span className="font-medium">Color Code </span>
                            <input onChange={(txt) => setColorCode(txt.target.value)} value={colorCode} required
                                   type="text"
                                   placeholder="#FFFFF"
                                   className="p-1 text-center border-2 border-slate-300 rounded"/>
                            <div className="h-8 mt-3 border-2"
                                 style={{backgroundColor: colorCode.length == 0 ? "" : "#ffff" + colorCode}}></div>
                        </label>
                        <label className="flex-col flex justify-center items-center gap-1">
                            <div className="flex  relative justify-center items-center flex-col">
                                <IoCloudUpload size={30}/>
                                <input value={file} onChange={(file) => handleFileSelect(file)} type="file" multiple
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
                        <div className="flex flex-row justify-evenly gap-5 items-center">
                            <label className="flex flex-col gap-1">
                                <span>Size</span>
                                <select
                                    onChange={(txt)=> setSelectedSize(txt.target.value)}
                                    defaultValue={selectedSize}
                                    value={selectedSize}
                                    className="p-1 text-center w-[10vw] border-2 border-slate-300 rounded"
                                >
                                    <option value="none">
                                        Select Size
                                    </option>
                                    {shoeSizesList.map((size, index) => (
                                        <option key={index} value={size}>{size}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex flex-col gap-1">
                                <span>Stock</span>
                                <input value={stock} onChange={(txt)=> setStock(Number.parseInt(txt.target.value))} type="number"
                                       className="p-1 text-center w-[10vw] border-2 border-slate-300 rounded"/>
                            </label>
                            <div className="flex pt-7 items-center justify-center">
                                <button onClick={()=>addSizeToTable()} type="button"
                                        className="flex px-2 bg-primary-100 p-1 rounded text-white font-medium flex-row items-center">
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
                                        className="odd:bg-slate-200 hover:bg-white even:bg-slate-300"
                                    >
                                        <td className="px-2">{size.size}</td>
                                        <td className="px-2">{size.stock}</td>
                                        <td className="px-2 flex flex-row gap-1 justify-end">
                                            <button onClick={()=> {
                                                setSelectedSize(size.size)
                                                setStock(size.stock)
                                                setSizes(prevState => prevState.filter((s, i) => i !== index))
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
                        <button
                            className="bg-primary-100 text-white flex flex-row justify-center items-center h-[2.8rem] px-3 py-1 rounded hover:bg-primary-200">
                            <IoAdd size={30}/>
                            Add Variant
                        </button>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">
                            Variants
                        </h2>
                        <div className="mt-2">
                            <table className="min-w-full table-auto text-center">
                                <thead>
                                <tr className="bg-slate-600 text-white">
                                    <th className="px-2">Variant ID</th>
                                    <th className="px-2">Color Code</th>
                                    <th className="px-2">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </form>
                <div className="absolute top-1 right-1">
                    <button onClick={() => {
                        setAddVariantForm(false)
                        setColorCode('')
                        setVariantId('')
                        setImages([])
                        setFile("")
                        setSelectedThumbnail({})
                        setSizes([])
                        setSelectedSize("none")
                        setStock(0)
                    }}>
                        <IoClose size={30}/>
                    </button>
                </div>
            </div>
        </DropShadow>
    );
};

export default ManageVariantsForm;
