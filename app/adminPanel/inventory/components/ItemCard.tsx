import React from 'react';
import {Item} from "@/interfaces";
import Image from "next/image";
import {IoPencil, IoTrash} from "react-icons/io5";
import Link from "next/link";

const ItemCard = ({item, onEdit, onDelete}:{item:Item, onEdit:any, onDelete:any}) => {
    return (
        <div className="flex flex-col gap-2 rounded-b-lg shadow-primary">
            <Link href="" className='w-full'>
                <Image src={item.thumbnail} alt={item.name} width={200} height={200} className="h-[20rem] w-[20rem]"/>
            </Link>
            <div className="p-2 capitalize flex-col flex gap-1 mt-2 text-sm">
                <h2 className="uppercase font-bold">{"ID - "+item.itemId}</h2>
                <h2 >{"Manufacturer - " + item.manufacturer}</h2>
                <h2>{"Brand - " + item.brand}</h2>
                <h2>{"Name - " + item.name}</h2>
            </div>
            <div className="w-full justify-between items-center flex gap-5 pb-3 px-3">
                <p className="text-blue-500 font-medium text-lg">
                    {item.variants.length+" Colors"}
                </p>
                <div className="flex flex-row gap-2">
                    <button onClick={onEdit} type="button" className="rounded-full bg-yellow-400 p-2 lg:hover:bg-yellow-500">
                        <IoPencil size={30}/>
                    </button>
                    <button  onClick={onDelete} type='button' className="rounded-full bg-red-500 lg:hover:bg-red-600 p-2">
                        <IoTrash size={30}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
