import React from 'react';
import DropShadow from "@/components/DropShadow";
import { OrderItem } from "@/interfaces";
import { IoClose } from "react-icons/io5";

const ItemsView = ({ items, setShowItems }: { items: OrderItem[], setShowItems: any }) => {
    return (
        <DropShadow>
            <section className="relative">
                <div className="bg-white p-6 pt-8 max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg">
                    <div>
                        <h2 className="text-lg font-bold md:text-xl">Items</h2>
                    </div>
                    <div className="overflow-auto mt-5">
                        <table className="min-w-full divide-y divide-gray-200 shadow-sm">
                            <thead className="bg-gray-100">
                            <tr className="text-sm text-gray-700">
                                <th className="px-6 py-3 text-left font-semibold tracking-wider">
                                    Item ID / Variant ID
                                </th>
                                <th className="px-6 py-3 text-left font-semibold tracking-wider">
                                    Item Description
                                </th>
                                <th className="px-6 py-3 text-left font-semibold tracking-wider">
                                    Quantity
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {items.map(item => (
                                <tr key={item.itemId} className="text-sm uppercase text-gray-700">
                                    <td className="px-6 py-4">
                                        <p className="font-medium">{item.itemId}</p>
                                        <p className="text-xs text-gray-500">{item.variantId}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.variantName}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold">{item.quantity}</span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-full mt-6 flex items-center justify-center">
                        <button
                            className="bg-primary-100 hover:bg-primary-200 transition px-6 py-2 rounded-md text-white font-semibold tracking-wide text-lg">
                            Print
                        </button>
                    </div>
                </div>

                <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition">
                    <button onClick={() => setShowItems(false)}>
                        <IoClose size={24}/>
                    </button>
                </div>
            </section>
        </DropShadow>
    );
};

export default ItemsView;
