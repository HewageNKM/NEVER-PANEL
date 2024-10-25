"use client"
import React, {useState} from 'react';
import {Order} from "@/interfaces";
import DropShadow from "@/components/DropShadow";
import {IoClose} from "react-icons/io5";
import {paymentStatus} from "@/constant";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {showToast} from "@/lib/toastSlice/toastSlice";
import {getToken} from "@/firebase/firebaseClient";
import {sortOrders} from "@/lib/orderSlice/orderSlice";
import {AppDispatch, RootState} from "@/lib/store";

const PaymentStatusView = ({order, setShowPaymentView, setSelectedOrder}: {
    order: Order,
    setShowPaymentView: any,
    setSelectedOrder: any
}) => {
    const [status, setStatus] = useState(order.paymentStatus);
    const [loading, setLoading] = useState(false)
    const dispatch:AppDispatch = useDispatch();
    const {page,size} = useSelector((state:RootState) => state.orderSlice);

    const updatePaymentStatus = async () => {
        setLoading(true);
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
            dispatch(sortOrders({page: page, size: size}));
            setSelectedOrder(newOrder);
        } else {
            dispatch(showToast({message: res.data, type: 'error'}));
        }
        setLoading(false);
    }
    return (
        <DropShadow>
            {loading ? (<div
                className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div className='flex space-x-2 justify-center items-center h-screen'>
                    <span className='sr-only'>Loading...</span>
                    <div className='h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                    <div className='h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                    <div className='h-8 w-8 bg-white rounded-full animate-bounce'></div>
                </div>
            </div>): (<div
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
                        <select
                            defaultValue={status}
                            value={status}
                            onChange={(e) => setStatus(e.target.value as paymentStatus)}
                            className="border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option disabled={status === paymentStatus.PAID || status === paymentStatus.REFUNDED}
                                    value={paymentStatus.PAID}>{paymentStatus.PAID}</option>
                            <option disabled={status === paymentStatus.PENDING || status === paymentStatus.REFUNDED}
                                    value={paymentStatus.PENDING || status === paymentStatus.REFUNDED}>{paymentStatus.PENDING}</option>
                            <option disabled={status === paymentStatus.FAILED || status === paymentStatus.REFUNDED}
                                    value={paymentStatus.FAILED || status === paymentStatus.REFUNDED}>{paymentStatus.FAILED}</option>
                            <option value={paymentStatus.REFUNDED}>{paymentStatus.REFUNDED}</option>
                        </select>


                        <button disabled={status == order.paymentStatus} onClick={() => updatePaymentStatus()}
                                className="bg-primary-100 text-white px-4 disabled:cursor-not-allowed disabled:opacity-60 py-2 rounded-md hover:bg-primary-200 transition">
                            Update
                        </button>
                    </div>

                    <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition">
                        <button onClick={() => setShowPaymentView(false)}>
                            <IoClose size={24}/>
                        </button>
                    </div>
                </div>
            )}
        </DropShadow>
    );
};

export default PaymentStatusView;
