import React from 'react';
import { IoSearch } from "react-icons/io5";

const Hero = () => {
    return (
        <section className="w-full pt-10">
            <div className="px-8 flex flex-col">
                <div>
                    {/*
                        Todo: Cards for the hero section
                    */}
                </div>
                <div className="relative w-full flex flex-col lg:flex-row justify-between items-center mt-6">
                    <div className="relative w-full lg:w-auto">
                        <label className="flex flex-col gap-1 mb-2">
                            <span className="font-medium text-lg lg:text-xl">Search</span>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="px-4 py-2 lg:w-[16rem] focus:outline-none bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-500 transition duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Search"
                                />
                                <button className="absolute top-1/2 transform -translate-y-1/2 right-3">
                                    <IoSearch className="text-gray-500 hover:text-blue-500 transition duration-200" />
                                </button>
                            </div>
                        </label>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:ml-4">
                        <label className="flex flex-col gap-1">
                            <span className="font-medium text-lg lg:text-xl">Filter</span>
                            <select className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                                <option className="">All</option>
                                <option className="">Processing</option>
                                <option className="">Delivered</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
