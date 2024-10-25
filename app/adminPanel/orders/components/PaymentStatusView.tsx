"use client"
import React, {useState} from 'react';
import {Order} from "@/interfaces";
import DropShadow from "@/components/DropShadow";
import {IoClose} from "react-icons/io5";
import {paymentStatus} from "@/constant";
import axios from "axios";
import {useDispatch} from "react-redux";
import {showToast} from "@/lib/toastSlice/toastSlice";
import {getToken} from "@/firebase/firebaseClient";

const PaymentStatusView = ({order, setShowPaymentView, setSelectedOrder}: {
    order: Order,
    setShowPaymentView: any,
    setSelectedOrder: any
}) => {
    const [status, setStatus] = useState(order.paymentStatus);
    const dispatch = useDispatch();
    const updatePaymentStatus = async () => {

        const newOrder: Order = {
            ...order,
            paymentStatus: status
        }
        const token = await getToken();
        const res = await axios({
            method: 'PUT',
            headers:{
                Authorization: `Bearer ${token}`
            },
            url: `/api/orders/${order.orderId}`,
            data: newOrder
        });
        if (res.status === 200) {
            setSelectedOrder(newOrder);
        } else {
            dispatch(showToast({message: res.data, type: 'error'}));
        }
    }
    return (
        <DropShadow>
            <div
                className="relative bg-white max-w-[90vw] flex flex-col gap-5 p-6 rounded-lg shadow-lg border border-gray-200">
                <h1 className="text-lg font-semibold mb-4">Payment Status</h1>

                <div className="flex flex-col gap-2 items-start space-x-4">
                    <div className="flex items-center justify-center gap-3 w-full">
                        {order.paymentStatus === paymentStatus.PAID && (
                            <div className="w-6 h-6 animate-pulse bg-green-500 rounded-full"></div>
                        )}
                        {order.paymentStatus === paymentStatus.PENDING && (
                            <div className="w-6 h-6 bg-yellow-500 animate-pulse rounded-full"></div>
                        )}
                        {
                            order.paymentStatus === paymentStatus.FAILED && (
                                <div className="w-6 h-6 animate-pulse bg-red-500 rounded-full"></div>
                            )
                        }
                        {
                            order.paymentStatus === paymentStatus.REFUNDED && (
                                <div className="w-6 h-6 animate-pulse bg-blue-500 rounded-full"></div>
                            )
                        }
                        <p className="text-sm md:text-lg text-gray-600 font-medium">{order.paymentStatus}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Last
                        updated: {new Date(order.createdAt._seconds * 1000 + order.createdAt._nanoseconds / 1000000).toLocaleString()}
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-evenly space-x-2">
                    <select defaultValue={status}
                            value={status}
                            onChange={(e) => setStatus(e.target.value as paymentStatus)}
                            className="border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option disabled={status === paymentStatus.PAID}
                                value={paymentStatus.PAID}>{paymentStatus.PAID}</option>
                        <option disabled={status === paymentStatus.PENDING}
                                value={paymentStatus.PENDING}>{paymentStatus.PENDING}</option>
                        <option disabled={status == paymentStatus.FAILED}
                                value={paymentStatus.FAILED}>{paymentStatus.FAILED}</option>
                        <option disabled={status === paymentStatus.REFUNDED}
                                value={paymentStatus.REFUNDED}>{paymentStatus.REFUNDED}</option>
                    </select>

                    <button onClick={() => updatePaymentStatus()}
                            className="bg-primary-100 text-white px-4 py-2 rounded-md hover:bg-primary-200 transition">
                        Update
                    </button>
                </div>

                <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition">
                    <button onClick={() => setShowPaymentView(false)}>
                        <IoClose size={24}/>
                    </button>
                </div>
            </div>
        </DropShadow>
    );
};

export default PaymentStatusView;
