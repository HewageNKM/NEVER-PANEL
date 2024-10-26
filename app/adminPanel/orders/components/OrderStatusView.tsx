'use client'
import React, {useEffect, useState} from 'react';
import DropShadow from "@/components/DropShadow";
import {Order, Tracking} from "@/interfaces";
import {IoClose} from "react-icons/io5";
import TrackingForm from "@/app/adminPanel/orders/components/TrackingForm";
import OrderStatus from "@/app/adminPanel/orders/components/OrderStatus";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getToken} from "@/firebase/firebaseClient";
import axios from "axios";
import {orderStatus} from "@/constant";
import {sortOrders} from "@/lib/orderSlice/orderSlice";

const OrderStatusView = ({order, setShowOrderStatusView, setOrder}: {
    order: Order,
    setShowOrderStatusView: any,
    setOrder: React.Dispatch<React.SetStateAction<Order>>
}) => {
    const [tracking, setTracking] = useState<Tracking | null>(order?.tracking);
    const [loading, setLoading] = useState(false)
    const dispatch: AppDispatch = useDispatch();
    const {page, size} = useSelector((state: RootState) => state.orderSlice);

    useEffect(() => {
        dispatch(sortOrders({page: page, size: size}));
    }, [dispatch, tracking]);

    const onTrackingFormSubmit = async (evt) => {
        evt.preventDefault();

        const tracking: Tracking = {
            trackingNumber: evt.target.trackingNumber.value,
            status: orderStatus.SHIPPED,
            trackingCompany: evt.target.courier.value,
            trackingUrl: evt.target.trackingUrl.value,
            updatedAt: {
                _seconds: Math.floor(Date.now() / 1000),
                _nanoseconds: 0,
            },
        }

        setTracking(tracking);
        evt.target.reset();

        if (tracking) {
            const newOrder = {
                ...order,
                tracking: tracking
            }
            saveOrder(newOrder).then(() => {
                setLoading(false);
                setShowOrderStatusView(false);
                dispatch(sortOrders({page: page, size: size}));
            });
            setOrder(newOrder);
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
            if (response.status === 200) {
                dispatch(sortOrders({page: page, size: size}));
            } else {
                new Error(response.data);
            }
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    const updateTracking = async (status: string) => {
        setLoading(true);
        const tracking: Tracking = {
            ...order.tracking,
            status: status as orderStatus,
            updatedAt: {
                _seconds: Math.floor(Date.now() / 1000),
                _nanoseconds: 0,
            },
        }
        setTracking(tracking);
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
            if (response.status === 200) {
                dispatch(sortOrders({page: page, size: size}));
            } else {
                new Error(response.data);
            }
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
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