import React from 'react';
import {Variant} from "@/interfaces";
import {IoPencil, IoTrash} from "react-icons/io5";
import ImagesSlider from "@/components/ImagesSlider";

const VariantCard = ({item}: { item: Variant }) => {
    return (
        <div className="flex flex-col gap-2 rounded-lg shadow-primary justify-center items-center">
            <div className="relative">
                <ImagesSlider images={item.images}/>
            </div>
            <div className="flex flex-col gap-2 px-4 py-2 text-lg font-medium capitalize">
                <h2 className="uppercase">Variant ID: {item.variantId}</h2>
                <h2>Name: {item.variantName}</h2>
                <h2 className="text-2xl font-bold mt-2">Sizes</h2>
                <div className="overflow-auto h-[10rem]">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2 text-left">Size</th>
                            <th className="border px-4 py-2 text-left">Stock</th>
                        </tr>
                        </thead>
                        <tbody>
                        {item.sizes.map((size, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50">
                                <td className="border px-4 py-2">{size.size}</td>
                                <td className="border px-4 py-2">{size.stock}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex py-2 flex-row gap-2 w-full justify-end items-center px-2">
                <button onClick={() => {
                }} type="button"
                        className="rounded-full bg-yellow-400 p-2 lg:hover:bg-yellow-500">
                    <IoPencil size={20}/>
                </button>
                <button onClick={() => {
                }} type='button' className="rounded-full bg-red-500 lg:hover:bg-red-600 p-2">
                    <IoTrash size={20}/>
                </button>
            </div>
        </div>
    );
};

export default VariantCard;
