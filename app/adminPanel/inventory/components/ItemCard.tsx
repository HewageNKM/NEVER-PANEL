import React from 'react';
import { Item } from "@/interfaces";
import Image from "next/image";
import { IoPencil, IoTrash } from "react-icons/io5";
import Link from "next/link";

const ItemCard = ({ item, onEdit, onDelete }: { item: Item, onEdit: any, onDelete: any }) => {
    return (
        <div className="flex flex-col bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow min-w-[18rem] duration-300 max-w-[90vw] sm:max-w-[48vw] md:max-w-[30vw] lg:max-w-xs overflow-hidden">
            <Link href={`/adminPanel/inventory/${item.itemId}`} className="w-full block group">
                <div className="relative w-full h-64 overflow-hidden">
                    <Image
                        src={item.thumbnail.url}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            </Link>
            <div className="p-4 flex flex-col gap-2">
                <h2 className="text-gray-800 font-bold text-lg truncate uppercase">ID: {item.itemId}</h2>
                <p className="text-gray-600 text-sm font-medium truncate">Manufacturer: {item.manufacturer.toUpperCase()}</p>
                <p className="text-gray-600 text-sm font-medium truncate">Brand: {item.brand.toUpperCase()}</p>
                <p className="text-gray-700 text-sm font-medium truncate">Name: {item.name}</p>
                <p className="text-yellow-500 font-semibold text-sm">Buying Price: LKR {item.buyingPrice}</p>
                <p className="text-green-600 font-semibold text-sm">Selling Price: LKR {item.sellingPrice}</p>
                <p className="text-gray-500 text-xs">
                    Created At: {item.createdAt ? item.createdAt : "N/A"}
                </p>
                <p className="text-gray-500 text-xs">
                    Updated At: {item.updatedAt ? item.updatedAt : "N/A"}
                </p>
            </div>
            <div className="flex items-center justify-between px-4 pb-4">
                <p className="text-blue-500 font-semibold text-sm">{item.variants.length} Colors</p>
                <div className="flex space-x-2">
                    <button
                        onClick={onEdit}
                        type="button"
                        className="p-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors duration-300 transform hover:scale-105">
                        <IoPencil size={18} />
                    </button>
                    <button
                        onClick={onDelete}
                        type="button"
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 transform hover:scale-105">
                        <IoTrash size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
