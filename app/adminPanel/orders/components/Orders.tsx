"use client";
import React, {useEffect, useState} from 'react';
import {Customer, Order, OrderItem, Tracking} from "@/interfaces";
import {IoArrowBack, IoArrowForward, IoEye, IoPencil} from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {fetchOrders, setOrders} from "@/lib/orderSlice/orderSlice";
import {AnimatePresence} from "framer-motion";
import ItemsView from "@/app/adminPanel/orders/components/ItemsView";
import CustomerView from "@/app/adminPanel/orders/components/CustomerView";
import OrderStatusView from "@/app/adminPanel/orders/components/OrderStatusView";

const Orders = ({orders}: { orders: Order[] }) => {
    const dispatch: AppDispatch = useDispatch();
    const orderList = useSelector((state: RootState) => state.orderSlice.orders);
    const [pageNumber, setPageNumber] = useState(1);

    const [items, setItems] = useState([] as OrderItem[]);
    const [customer, setCustomer] = useState({} as Customer)
    const [tracking, setTracking] = useState<Tracking | null>({} as Tracking)

    const [showItems, setShowItems] = useState(false)
    const [showCustomer, setShowCustomer] = useState(false)
    const [showOrderStatus, setShowOrderStatus] = useState(false)
    const [showPaymentStatus, setShowPaymentStatus] = useState(false)

    useEffect(() => {
        dispatch(setOrders(orders));
    }, [dispatch, orders]);

    useEffect(() => {
        dispatch(fetchOrders({pageNumber: pageNumber, size: 20}));
    }, [pageNumber, dispatch]);

    console.log(orderList.map(order => order.createdAt));
    return (
        <section className="mt-8">
            <div className="overflow-auto h-[80vh] w-full flex px-8 flex-col justify-between items-center">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr className="text-sm">
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Order
                            ID
                        </th>
                        <th className="px-6 py-3 text-left  font-medium text-gray-500 uppercase tracking-wider">Order
                            Date/Time
                        </th>
                        <th className="px-6 py-3 text-left  font-medium text-gray-500 uppercase tracking-wider">Customer
                            Details
                        </th>
                        <th className="px-6 py-3 text-left  font-medium text-gray-500 uppercase tracking-wider">
                            Items
                        </th>
                        <th className="px-6 py-3 text-left  font-medium text-gray-500 uppercase tracking-wider">Order
                            Status
                        </th>
                        <th className="px-6 py-3 text-left  font-medium text-gray-500 uppercase tracking-wider">Order
                            Total
                        </th>
                        <th className="px-6 py-3 text-left  font-medium text-gray-500 uppercase tracking-wider">Shipping
                            Cost
                        </th>
                        <th className="px-6 py-3 text-left  font-medium text-gray-500 uppercase tracking-wider">Payment
                            Method
                        </th>
                        <th className="px-6 py-3 text-left  font-medium text-gray-500 uppercase tracking-wider">Payment
                            Status
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {/* Table rows will go here */}
                    {orderList.map((order, index) => (
                        <tr key={order.orderId} className="font-bold text-lg">
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">#{order.orderId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">{typeof order.createdAt === "string" ? new Date(order.createdAt).toLocaleString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                            }) : new Date(order.createdAt._seconds * 1000 + Math.floor(order.createdAt._nanoseconds / 1000000)).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                <div className="flex flex-row gap-2">
                                    <p>{order.customer.name}</p>
                                    <button onClick={()=>{
                                        setCustomer(order.customer)
                                        setShowCustomer(true)
                                    }} className="text-indigo-600 hover:text-indigo-900">
                                        <IoEye size={20} color={"blue"}/>
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                <div className="flex flex-row gap-2">
                                    <p>{order.items.length}</p>
                                    <button onClick={()=>{
                                        setItems(order.items)
                                        setShowItems(true)}
                                    } className="text-indigo-600 hover:text-indigo-900">
                                        <IoEye size={20} color={"blue"}/>
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex flex-row gap-2">
                                    <p className={`px-2 py-1  inline-flex text-sm leading-5 font-semibold rounded-full ${order.tracking?.status == "Shipped" ? "bg-yellow-100 text-yellow-800" : order.tracking?.status == "Delivered" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                                        {order.tracking?.status == "Shipped" ? "Shipped" : order.tracking?.status == "Delivered" ? "Delivered" : "Processing"}
                                    </p>
                                    <button
                                        onClick={()=> {
                                            setTracking(order.tracking)
                                            setShowOrderStatus(true)
                                        }}
                                        className="text-indigo-600 text-lg hover:text-indigo-900"><IoPencil
                                        size={20} color={"blue"}/></button>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap  text-gray-900">Rs.{order.items.reduce((acc, item) => acc + item.price, 0)}</td>
                            <td className="px-6 py-4 whitespace-nowrap  text-gray-900">Rs.{order.shippingCost}</td>
                            <td className="px-6 py-4 whitespace-nowrap  text-gray-900">{order.paymentMethod}</td>
                            <td className="px-6 py-4 whitespace-nowrap  text-gray-900">
                                <div className="flex flex-row gap-2">
                                    <p className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${order.paymentStatus == "Paid" ? "bg-green-100 text-green-800" : order.paymentStatus == "Pending" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>
                                        {order.paymentStatus}
                                    </p>
                                    <button
                                        className="text-indigo-600 hover:text-indigo-900 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                        disabled={order.paymentMethod == "PayHere"}>
                                        <IoPencil size={20} color={"blue"}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {/* Repeat <tr> blocks for more rows */}
                    </tbody>
                </table>
                <div className="w-full justify-center items-center">
                    <div className="flex flex-row gap-5 justify-center">
                        <button onClick={() => {
                            if (pageNumber > 1) {
                                setPageNumber(pageNumber - 1);
                            } else {
                                setPageNumber(1);
                            }
                        }}>
                            <IoArrowBack size={23}/>
                        </button>
                        <p className="text-2xl font-bold">{pageNumber}</p>
                        <button onClick={() => {
                            setPageNumber(pageNumber + 1);
                        }}>
                            <IoArrowForward size={23}/>
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {showItems && (
                    <ItemsView  items={items} setShowItems={setShowItems}/>
                )}
                {showCustomer && (<CustomerView customer={customer} setShowCustomer={setShowCustomer} />)}
                {showOrderStatus && (<OrderStatusView  setShowOrderStatusView={setShowOrderStatus} tracking={tracking}/>)}
            </AnimatePresence>
        </section>
    );
};

export default Orders;