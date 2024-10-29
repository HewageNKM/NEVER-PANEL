"use client";
import React, {useState} from 'react';
import {Customer, Order, OrderItem} from "@/interfaces";
import {IoArrowBack, IoArrowForward, IoEye, IoPencil} from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {setPage} from "@/lib/orderSlice/orderSlice";
import {AnimatePresence} from "framer-motion";
import ItemsView from "@/app/adminPanel/orders/components/ItemsView";
import CustomerView from "@/app/adminPanel/orders/components/CustomerView";
import OrderStatusView from "@/app/adminPanel/orders/components/OrderStatusView";
import {orderStatus, paymentStatus} from "@/constant";
import EmptyState from "@/components/EmptyState";
import DropShadow from "@/components/DropShadow";
import PaymentStatusView from "@/app/adminPanel/orders/components/PaymentStatusView";

const Orders = () => {
    const dispatch: AppDispatch = useDispatch();
    const {orders, loading, page} = useSelector((state: RootState) => state.orderSlice);

    const [items, setItems] = useState([] as OrderItem[]);
    const [customer, setCustomer] = useState({} as Customer)
    const [selectedOrder, setSelectedOrder] = useState<Order>({} as Order)

    const [showItems, setShowItems] = useState(false)
    const [showCustomer, setShowCustomer] = useState(false)
    const [showOrderStatus, setShowOrderStatus] = useState(false)
    const [showPaymentStatus, setShowPaymentStatus] = useState(false)


    return (
        <section className="mt-8">
            <div
                className="overflow-x-auto relative lg:overflow-x-clip h-[65vh] w-full flex px-8 flex-col justify-between items-center">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr className="text-sm">
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Order
                            ID
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Order
                            Date/Time
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Customer
                            Details
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Order
                            Status
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Order
                            Total
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Shipping
                            Cost
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Payment
                            Method
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Payment
                            ID
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Payment
                            Status
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                        <tr key={order.orderId} className="font-bold text-lg">
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">#{order.orderId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">{new Date(order.createdAt._seconds * 1000 + order.createdAt._nanoseconds / 1000000).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                <div className="flex flex-row gap-2">
                                    <p>{order.customer.name}</p>
                                    <button onClick={() => {
                                        setCustomer(order.customer);
                                        setShowCustomer(true);
                                    }} className="text-indigo-600 hover:text-indigo-900">
                                        <IoEye size={20} color={"blue"}/>
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                <div className="flex flex-row gap-2">
                                    <p>{order.items.length}</p>
                                    <button onClick={() => {
                                        setItems(order.items);
                                        setShowItems(true);
                                    }} className="text-indigo-600 hover:text-indigo-900">
                                        <IoEye size={20} color={"blue"}/>
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex flex-row gap-2">
                                    <p className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                                             ${order.tracking?.status === orderStatus.SHIPPED ? "bg-yellow-100 text-yellow-800" :
                                        order.tracking?.status === orderStatus.DELIVERED ? "bg-green-100 text-green-800" :
                                            order.tracking?.status === orderStatus.PROCESSING ? "bg-blue-100 text-blue-800" :
                                                order.tracking?.status === orderStatus.CANCELLED ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                                        {order.tracking?.status || "Processing"}
                                    </p>

                                    <button
                                        disabled={(order.paymentStatus === paymentStatus.PENDING || order.paymentStatus == paymentStatus.FAILED) && order.paymentMethod === "PayHere"}
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowOrderStatus(true);
                                        }}
                                        className="text-indigo-600 text-lg hover:text-indigo-900 disabled:opacity-60 disabled:cursor-not-allowed">
                                        <IoPencil size={20} color={"blue"}/>
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">Rs.{order.items.reduce((total, item) => total + item.price * item.quantity, 0)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">Rs.{order.shippingCost}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">{order.paymentMethod}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">{order.paymentId || "None"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                <div className="flex flex-row gap-2">
                                    <p className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${order.paymentStatus == "Paid" ? "bg-green-100 text-green-800" : order.paymentStatus == "Pending" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>
                                        {order.paymentStatus}
                                    </p>
                                    <button
                                        className="text-indigo-600 hover:text-indigo-900 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                        disabled={order.tracking?.status == orderStatus.CANCELLED}>
                                        <IoPencil size={20} color={"blue"}
                                                  onClick={() => {
                                                      setSelectedOrder(order);
                                                      setShowPaymentStatus(true);
                                                  }}
                                        />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="w-full justify-center items-center">
                    <div className="flex flex-row gap-5 justify-center">
                        <button onClick={() => dispatch(setPage(page - 1))} disabled={page === 1}
                                className="bg-primary-100 text-white px-4 py-2 rounded-lg">
                            <IoArrowBack size={20}/>
                        </button>
                        <span className="text-lg font-semibold">{page}</span>
                        <button onClick={() => dispatch(setPage(page + 1))}
                                className="bg-primary-100 text-white px-4 py-2 rounded-lg">
                            <IoArrowForward size={20}/>
                        </button>
                    </div>
                </div>
                {(orders.length === 0 && !loading) && (
                    <div className="absolute top-1/2">
                        <EmptyState title={"No Orders Found!"} subtitle={"Please check back later"}/>
                    </div>
                )}
                {loading && (
                    <DropShadow>
                        <EmptyState title={"Loading Orders"} subtitle={"Please wait while we fetch the orders"}
                                    containerStyles="animate-pulse"/>
                    </DropShadow>
                )}
            </div>
            <AnimatePresence>
                {showItems && (
                    <ItemsView items={items} setShowItems={setShowItems}/>
                )}
                {showCustomer && (<CustomerView customer={customer} setShowCustomer={setShowCustomer}/>)}
                {showOrderStatus && (
                    <OrderStatusView setShowOrderStatusView={setShowOrderStatus} order={selectedOrder}
                                     setOrder={setSelectedOrder}/>
                )}
                {showPaymentStatus && (
                    <PaymentStatusView order={selectedOrder} setShowPaymentView={setShowPaymentStatus}
                                       setSelectedOrder={setSelectedOrder}/>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Orders;
