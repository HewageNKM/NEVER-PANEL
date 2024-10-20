"use client"
import React from 'react';
import {Tracking} from "@/interfaces";

const TrackingForm = ({tracking, onTrackingFormSubmit}: {
    tracking: Tracking | null,
    onTrackingFormSubmit: any
}) => {

    return (
        <div className="w-full">
            <form onSubmit={onTrackingFormSubmit}>
                <div className="flex flex-col space-y-4">
                    <legend className="text-xl font-semibold text-gray-800">Tracking Details</legend>
                    <div className="bg-gray-50 p-4 rounded-md w-full flex-col flex gap-5 shadow-inner">
                        <label className="flex items-start flex-col gap-2">
                            <p className="text-sm font-medium rounded text-gray-600">Tracking Number:</p>
                            <input defaultValue={tracking?.trackingNumber} type="text"
                                   name="trackingNumber"
                                   required
                                   className="px-4 py-2 lg:w-[16rem] w-full focus:outline-none bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-500 transition duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   placeholder="LK-XXXXXX-XXXX"/>
                        </label>
                        <label className="flex items-start flex-col gap-2">
                            <p className="text-sm font-medium text-gray-600">Courier:</p>
                            <input type="text"
                                   defaultValue={tracking?.trackingCompany}
                                   name="courier"
                                   required
                                   className="px-4 py-2 lg:w-[16rem] w-full focus:outline-none bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-500 transition duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   placeholder="Domex"/>
                        </label>
                        <label className="flex items-start flex-col gap-2">
                            <p className="text-sm font-medium text-gray-600">Tracking URl:</p>
                            <input type="text"
                                   defaultValue={tracking?.trackingUrl}
                                   name="trackingUrl"
                                   required
                                   className="px-4 py-2 lg:w-[16rem] w-full focus:outline-none bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-500 transition duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   placeholder="https://www.domex.lk/"/>
                        </label>
                    </div>
                    <div className="w-full flex justify-center items-center">
                        <button
                            className="bg-primary-100 hover:bg-primary-200 transition px-6 py-2 rounded-md text-white font-semibold tracking-wide text-lg mt-4">
                            Ship
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TrackingForm;