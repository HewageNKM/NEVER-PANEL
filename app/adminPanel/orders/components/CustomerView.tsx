import React from 'react';
import DropShadow from "@/components/DropShadow";
import { Customer } from "@/interfaces";
import { IoClose } from "react-icons/io5";

const CustomerView = ({ customer, setShowCustomer }: { customer: Customer, setShowCustomer: any }) => {
    return (
        <DropShadow>
            <section className="relative">
                <div className="bg-white p-6 pt-12 overflow-auto max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg relative">
                    <div className="w-full flex-col flex items-center justify-center space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Customer Details</h2>
                        <div className="bg-gray-50 p-4 rounded-md w-full md:max-w-lg shadow-inner">
                            <div className="flex items-center space-x-2 mb-2">
                                <p className="text-sm font-medium text-gray-600">Name:</p>
                                <p className="text-sm text-gray-800">{customer.name}</p>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                                <p className="text-sm font-medium text-gray-600">Email:</p>
                                <p className="text-sm text-gray-800">{customer.email}</p>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                                <p className="text-sm font-medium text-gray-600">Phone:</p>
                                <p className="text-sm text-gray-800">{customer.phone}</p>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                                <p className="text-sm font-medium text-gray-600">Address:</p>
                                <p className="text-sm text-gray-800">{customer.address}</p>
                            </div>
                        </div>
                        <button
                            className="bg-primary-100 hover:bg-primary-200 transition px-6 py-2 rounded-md text-white font-semibold tracking-wide text-lg mt-4">
                            Print
                        </button>
                    </div>
                    <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
                        onClick={() => setShowCustomer(false)}>
                        <IoClose size={24} />
                    </button>
                </div>
            </section>
        </DropShadow>
    );
};

export default CustomerView;
