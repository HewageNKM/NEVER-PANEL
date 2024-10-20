'use client'
import React, {useState} from 'react';
import DropShadow from "@/components/DropShadow";
import {Order, Tracking} from "@/interfaces";
import {IoClose} from "react-icons/io5";
import TrackingForm from "@/app/adminPanel/orders/components/TrackingForm";
import OrderStatus from "@/app/adminPanel/orders/components/OrderStatus";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import {getToken} from "@/firebase/firebaseClient";
import axios from "axios";
import {fetchOrders} from "@/lib/orderSlice/orderSlice";
import {orderStatus} from "@/constant";

const OrderStatusView = ({order, setShowOrderStatusView, setOrder}: {
    order: Order,
    setShowOrderStatusView: any,
    setOrder: React.Dispatch<React.SetStateAction<Order>>
}) => {
    const [tracking, setTracking] = useState<Tracking | null>(order?.tracking);
    const [loading, setLoading] = useState(false)
    const dispatch: AppDispatch = useDispatch();

    const onTrackingFormSubmit = (evt) => {
        evt.preventDefault();

        const tracking: Tracking = {
            trackingNumber: evt.target.trackingNumber.value,
            status: orderStatus.SHIPPED,
            trackingCompany: evt.target.courier.value,
            trackingUrl: evt.target.trackingUrl.value,
            updatedAt: Date.now().toLocaleString()
        }

        setTracking(tracking);
        evt.target.reset();

        if (tracking) {
            const newOrder = {
                ...order,
                tracking: tracking
            }
            setOrder(newOrder);
            saveOrder(newOrder).then(() => {
                setLoading(false);
                setShowOrderStatusView(false);
                dispatch(fetchOrders({pageNumber: 1, size: 20}));
            });
        }
    }

    const saveOrder = async (newOrder: Order) => {
        setLoading(true);
        try {
            const token = await getToken();
            const response = await axios({
                method: 'PUT',
                url: `/api/orders/${newOrder.orderId}`,
                data: JSON.stringify(newOrder),
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
    const updateTracking = async (status: string) => {
        console.log(status);

        const tracking: Tracking = {
            ...order.tracking,
            status: status,
            updatedAt: Date.now().toLocaleString(),
        }
        const newOrder = {
            ...order,
            tracking: tracking
        }
        try {
            const token = await getToken();
            const response = await axios({
                method: 'PUT',
                url: `/api/orders/${newOrder.orderId}`,
                data: JSON.stringify(newOrder),
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setOrder(newOrder);
            if (response.data) {
                dispatch(fetchOrders({pageNumber: 1, size: 20}));
            } else {
                console.log(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <DropShadow>
            {loading ? (
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                        <div className='flex space-x-2 justify-center items-center h-screen'>
                            <span className='sr-only'>Loading...</span>
                            <div className='h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                            <div className='h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                            <div className='h-8 w-8 bg-white rounded-full animate-bounce'></div>
                        </div>
                    </div>)
                :
                (
                    <section className="bg-white relative rounded p-4 max-w-[90vw]">
                        <div>
                            {order.tracking == null ? (
                                <TrackingForm onTrackingFormSubmit={onTrackingFormSubmit} tracking={tracking}/>) : (
                                <OrderStatus tracking={tracking} updateTracking={updateTracking}/>)
                            }
                        </div>

                        <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition">
                            <button onClick={() => setShowOrderStatusView(false)}>
                                <IoClose size={24}/>
                            </button>
                        </div>
                    </section>
                )}
        </DropShadow>
    );
};

export default OrderStatusView;