import React from 'react';
import { Variant } from "@/interfaces";
import { IoPencil, IoTrash } from "react-icons/io5";
import ImagesSlider from "@/components/ImagesSlider";

const VariantCard = ({
                         item,
                         onPencil,
                         onTrash
                     }: {
    item: Variant,
    onPencil: () => void,
    onTrash: () => void
}) => {

    return (
        <div
            className="flex flex-col gap-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 md:w-[20rem] w-[100%] max-w-[18rem]">
            <div className="w-full text-lg">
                <ImagesSlider images={item.images}/>
            </div>

            <div className="flex flex-col gap-3 text-sm md:text-base">
                <div className="flex flex-col">
                    <span className="font-bold">Variant ID</span>
                    <input
                        disabled
                        value={item.variantId}
                        className="p-2 border border-gray-300 rounded-lg text-sm md:text-base uppercase bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div className="flex flex-col">
                    <span className="font-bold">Variant Name</span>
                    <input
                        disabled
                        value={item.variantName}
                        className="p-2 border border-gray-300 rounded-lg text-sm md:text-base capitalize bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <h2 className="font-bold text-xl mt-3">Sizes</h2>
                <div className="overflow-auto h-[7rem] border border-gray-300 rounded-lg">
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

            <div className="flex flex-row gap-3 justify-end mt-4">
                <button
                    onClick={onPencil}
                    type="button"
                    className="rounded-full bg-yellow-400 p-2 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-300 transition duration-200">
                    <IoPencil size={20} className="text-white"/>
                </button>
                <button
                    onClick={onTrash}
                    type="button"
                    className="rounded-full bg-red-500 p-2 hover:bg-red-600 focus:ring-2 focus:ring-red-300 transition duration-200">
                    <IoTrash size={20} className="text-white"/>
                </button>
            </div>
        </div>
    );
};

export default VariantCard;
