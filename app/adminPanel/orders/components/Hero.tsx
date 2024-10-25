"use client"
import React, {useEffect} from 'react';
import {IoReload, IoReloadSharp, IoSearch} from "react-icons/io5";
import {orderStatus, orderStatusList, recordsSizes} from "@/constant";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {setLoading, setSelectedSort, setSize, sortOrders} from "@/lib/orderSlice/orderSlice";
import OrderSearch from "@/app/adminPanel/orders/components/OrderSearch";

const Hero = () => {
    const dispatch: AppDispatch = useDispatch();
    const selectedSortOption = useSelector((state: RootState) => state.orderSlice.selectedSort);
    const {page, size} = useSelector((state: RootState) => state.orderSlice);

    const fetch = () => {
        dispatch(setLoading(true));
        dispatch(sortOrders({page, size}));
    }
    // Fetch orders and sort them based on the selected sort option
    useEffect(() => {
        fetch()
    }, [dispatch, page, selectedSortOption, size])

    return (
        <section className="w-full pt-10">
            <div className="px-8 flex flex-col">
                <div>
                    {/*
                        Todo: Cards for the hero section
                    */}
                </div>
                <div
                    className="relative w-full flex flex-wrap lg:gap-0 gap-5 flex-row justify-between items-center mt-6">
                    <div className="relative flex flex-col gap-2">
                        <label className="flex flex-col gap-1 mb-2">
                            <span className="font-medium text-lg lg:text-xl">Search</span>
                            <div className="relative">
                               <OrderSearch />
                            </div>
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="font-medium text-lg lg:text-xl">Records</span>
                            <div className="flex flex-row items-center gap-2 ">
                                <select defaultValue=""
                                        onChange={(e) => dispatch(setSize(Number(e.target.value)))}
                                        value={size}
                                        className="px-3 py-2 bg-white lg:w-fit w-[12rem] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                                    {
                                        recordsSizes.map(status => (
                                            <option key={status.id} value={status.value}>{status.name}</option>
                                        ))
                                    }
                                </select>
                                <button
                                    onClick={() => fetch()}
                                    className="text-black hover:bg-primary-50 p-1 rounded transition-all duration-300">
                                    <IoReloadSharp size={35}/>
                                </button>
                            </div>
                        </label>
                </div>
                    <div>
                    <label className="flex flex-col gap-1">
                            <span className="font-medium text-lg lg:text-xl">Filter</span>
                            <select defaultValue=""
                                    onChange={(e) => dispatch(setSelectedSort(e.target.value as orderStatus))}
                                    value={selectedSortOption}
                                    className="px-3 py-2 bg-white lg:w-fit w-[12rem] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                                <option value="">All</option>
                                {
                                    orderStatusList.map(status => (
                                        <option key={status.id} value={status.value}>{status.name}</option>
                                    ))
                                }
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
