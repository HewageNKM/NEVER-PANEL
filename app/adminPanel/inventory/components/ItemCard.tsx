import React from 'react';
import { Item } from "@/interfaces";
import Image from "next/image";
import { IoPencil, IoTrash } from "react-icons/io5";
import Link from "next/link";

const ItemCard = ({ item, onEdit, onDelete }: { item: Item, onEdit: any, onDelete: any }) => {
    return (
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 max-w-[90vw] lg:max-w-xs">
            <Link href={`/adminPanel/inventory/${item.itemId}`} className="w-full">
                <Image
                    src={item.thumbnail}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-[16rem] object-cover rounded-t-lg"
                />
            </Link>
            <div className="p-4 flex flex-col gap-2">
                <h2 className="text-gray-700 font-bold text-lg uppercase">{"ID: " + item.itemId}</h2>
                <p className="text-gray-600 text-sm font-medium">{"Manufacturer: " + item.manufacturer}</p>
                <p className="text-gray-600 text-sm font-medium">{"Brand: " + item.brand}</p>
                <p className="text-gray-600 text-sm font-medium">{"Name: " + item.name}</p>
            </div>
            <div className="flex items-center justify-between px-4 pb-4">
                <p className="text-blue-500 font-semibold text-sm">{item.variants.length} Colors</p>
                <div className="flex space-x-2">
                    <button
                        onClick={onEdit}
                        type="button"
                        className="p-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors">
                        <IoPencil size={18} />
                    </button>
                    <button
                        onClick={onDelete}
                        type="button"
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                        <IoTrash size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
