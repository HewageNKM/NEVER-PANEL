"use client"
import React, {useState} from 'react';
import {Tracking} from "@/interfaces";
import Link from "next/link";
import {orderStatus, orderStatusList} from "@/constant";

const OrderStatus = ({tracking,updateTracking}: { tracking: Tracking | null ,updateTracking:any}) => {
    const [selectedStatus, setSelectedStatus] = useState(tracking?.status);
    return (
        <section>
            <div className="p-8 bg-white">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Order Status
                </h2>
                <div className="mb-6">
                    <p className="text-gray-600">
                        <span className="font-semibold">Tracking Number:</span> {tracking?.trackingNumber}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-semibold">Courier:</span> {tracking?.trackingCompany}
                    </p>
                    <Link href={tracking?.trackingUrl || ""}>
                        <p className="text-blue-500 hover:underline">
                            Tracking URL
                        </p>
                    </Link>
                </div>
                <div className="mb-6">
                    <p className="text-gray-600">
                        <span className="font-semibold">Status:</span> {tracking?.status}
                    </p>
                    <p className="text-gray-600">
                        <span
                            className="font-semibold">Last Updated:</span> {new Date(tracking?.updatedAt._seconds * 1000 + tracking?.updatedAt._nanoseconds / 1000000).toLocaleString()}
                    </p>
                </div>
                <div className="flex flex-col gap-1">
                    <h3>
                        Update Status
                    </h3>
                    <div className="flex-row flex justify-start gap-10">
                        <label className="block">
                            <select
                                defaultValue={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {orderStatusList.map((status) => {
                                    const isDisabled = (() => {
                                        // Check if the order is canceled
                                        if (tracking?.status === orderStatus.CANCELLED) {
                                            return true; // Disable all options for canceled orders
                                        }

                                        // Conditions for other statuses
                                        if (tracking?.status === orderStatus.SHIPPED) {
                                            // Shipped orders can only be changed to Shipped, Delivered, or Returned
                                            return ![orderStatus.SHIPPED, orderStatus.DELIVERED, orderStatus.RETURNED].includes(status.value);
                                        }
                                        if (tracking?.status === orderStatus.DELIVERED) {
                                            // Delivered orders can only be changed to Returned
                                            return status.value !== orderStatus.RETURNED;
                                        }
                                        if (tracking?.status === orderStatus.RETURNED) {
                                            // Returned orders can only be changed to Cancelled
                                            return status.value !== orderStatus.CANCELLED;
                                        }
                                        if (tracking?.status === orderStatus.PROCESSING) {
                                            // Processing orders can only select Shipped or Cancelled
                                            return ![orderStatus.SHIPPED, orderStatus.CANCELLED].includes(status.value);
                                        }
                                        return false; // No restrictions for other statuses
                                    })();

                                    return (
                                        <option key={status.id} value={status.value} disabled={isDisabled}>
                                            {status.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </label>
                        <button
                            disabled={selectedStatus === tracking?.status}
                            onClick={() => updateTracking(selectedStatus)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow disabled:bg-opacity-60 disabled:cursor-not-allowed hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderStatus;
