"use client"
import React, {useEffect} from 'react';
import {IoSearch} from "react-icons/io5";
import {orderStatus, orderStatusList, recordsSizes} from "@/constant";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {setLoading, setSelectedSort, setSize, sortOrders} from "@/lib/orderSlice/orderSlice";

const Hero = () => {
    const dispatch: AppDispatch = useDispatch();
    const selectedSortOption = useSelector((state: RootState) => state.orderSlice.selectedSort);
    const {page, size} = useSelector((state: RootState) => state.orderSlice);

    // Fetch orders and sort them based on the selected sort option
    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(sortOrders({page, size}));
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
                                <input
                                    type="text"
                                    className="px-4 py-2 lg:w-[16rem] w-[12rem] focus:outline-none bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-500 transition duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Search"
                                />
                                <button className="absolute top-1/2 transform -translate-y-1/2 right-3">
                                    <IoSearch className="text-gray-500 hover:text-blue-500 transition duration-200"/>
                                </button>
                            </div>
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="font-medium text-lg lg:text-xl">Records</span>
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
