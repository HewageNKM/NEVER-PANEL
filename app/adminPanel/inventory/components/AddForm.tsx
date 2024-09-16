import React from 'react';
import {brands, types} from "@/constant";
import {IoClose} from "react-icons/io5";
import DropShadow from "@/components/DropShadow";

const AddForm = ({
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
}) => {
    return (
        <DropShadow>
            <div className="bg-white z-50 w-[90vw] flex h-fit rounded p-4 relative">
                <form onSubmit={onSubmit} className="flex-col w-full  flex gap-5">
                    <legend className="text-2xl font-bold">
                        Add Item
                    </legend>
                    <div className="mt-5 flex w-full flex-row justify-center items-center flex-wrap gap-8">
                        <label className="flex-col hidden gap-1">
                            <input required type="text"
                                   value={id}
                                   onChange={(txt) => setId(txt.target.value)}
                                   placeholder="Jordan, Campus......"
                                   className="p-1 border-2 capitalize border-slate-300 rounded"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium">Type</span>
                            <select disabled={updateState} required value={type}
                                    onChange={(txt) => setType(txt.target.value)}
                                    defaultValue="none" className="p-1 border-2 border-slate-300 rounded">
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
                                    defaultValue="none" className="p-1 border-2 border-slate-300 rounded">
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

export default AddForm;
