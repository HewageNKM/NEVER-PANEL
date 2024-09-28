import React from 'react';
import {brands, types} from "@/constant";
import {IoClose, IoCloudUpload} from "react-icons/io5";
import DropShadow from "@/components/DropShadow";
import Image from "next/image";
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

    console.log(thumbnail)
    return (
        <DropShadow>
            <div className="bg-white z-50 w-[90vw] flex h-fit rounded p-4 relative">
                <form onSubmit={onSubmit} className="flex-col w-full  flex gap-2">
                    <legend className="text-2xl font-bold">
                        Item
                    </legend>

                    <div className="flex relative justify-center items-center flex-col">
                        {thumbnail.url &&
                            <div className="flex flex-row gap-2">
                                <Link target="_blank" href={thumbnail.url} className="lg:hover:border-b-2 h-6 lg:border-b-black transition-all">thumbnail</Link>
                                <button disabled={updateState} className="bg-black p-1 rounded-full" onClick={()=> setThumbnail({file:null,url:null})}>
                                    <IoClose size={17} color="White"/>
                                </button>
                            </div>
                        }

                        <div className="flex mt-5 relative justify-center items-center flex-col">
                            <IoCloudUpload size={30}/>
                            <p>
                                Upload Image
                            </p>
                            <input disabled={updateState}
                                   type="file" multiple
                                   accept=".jpeg, .jpg, .png"
                                   onChange={(file)=>handleFile(file)}
                                   className="absolute w-[10vw] border-2 p-1 h-[10vh] opacity-0 bg-black"/>
                        </div>
                    </div>
                    <div className="mt-5 flex w-full flex-row justify-center items-center flex-wrap gap-3 md:gap-8">
                        <label className="flex-col hidden gap-1">
                            <span className="font-medium">Product ID</span>
                            <input type="text"
                                   value={id}
                                   onChange={(txt) => setId(txt.target.value)}
                                   placeholder="Jordan, Campus......"
                                   className="p-1 border-2 capitalize border-slate-300 rounded"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium">Type</span>
                            <select disabled={updateState} required value={type}
                                    onChange={(txt) => setType(txt.target.value)}
                                    defaultValue="none" className="p-1 border-2 w-[10rem] border-slate-300 rounded">
                                {types.map((types, index) => (
                                    <option key={index} value={types.value}>{types.name}</option>
                                ))}
                                <option key={0} value="none">Select</option>
                            </select>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium">Manufacture</span>
                            <select disabled={updateState} required value={manufacture}
                                    onChange={(txt) => setManufacture(txt.target.value)}
                                    defaultValue="none" className="p-1 border-2 w-[10rem] border-slate-300 rounded">
                                {brands.map((brand, index) => (
                                    <option key={index} value={brand.value}>{brand.name}</option>
                                ))}
                                <option key={0} value="none">Select</option>
                            </select>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium">Brand</span>
                            <input required type="text"
                                   value={brand}
                                   onChange={(txt) => setBrand(txt.target.value)}
                                   placeholder="Jordan, Campus......"
                                   className="p-1 border-2 capitalize border-slate-300 rounded"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium">Name</span>
                            <input required value={name} onChange={(txt) => setName(txt.target.value)} type="text"
                                   placeholder="Nike Air Max 90"
                                   className="p-1 border-2 capitalize border-slate-300 rounded"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium">Buying Price(Rs)</span>
                            <input required value={buyingPrice} onChange={(txt) => setBuyingPrice(txt.target.value)}
                                   type="number" placeholder="3000"
                                   className="p-1 border-2 border-slate-300 rounded"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium">Selling Price(Rs)</span>
                            <input required value={sellingPrice} onChange={(txt) => setSellingPrice(txt.target.value)}
                                   type="number" placeholder="8000"
                                   className="p-1 border-2 border-slate-300 rounded"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium">Discount(%)</span>
                            <input required value={discount} onChange={(txt) => setDiscount(txt.target.value)}
                                   type="number"
                                   placeholder="20"
                                   className="p-1 border-2 border-slate-300 rounded"/>
                        </label>
                    </div>
                    <div className='w-full flex justify-center'>
                        <button
                            className="bg-primary-100 text-white flex font-medium flex-row justify-center items-center h-[2.8rem] px-3 py-1 rounded hover:bg-primary-200">
                            {updateState ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
                <div className="absolute top-1 right-1">
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
                    }}>
                        <IoClose size={30}/>
                    </button>
                </div>
            </div>
        </DropShadow>
    );
};

export default ItemForm;
