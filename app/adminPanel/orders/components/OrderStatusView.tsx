import React from 'react';
import DropShadow from "@/components/DropShadow";
import {Tracking} from "@/interfaces";
import {IoClose} from "react-icons/io5";
import TrackingForm from "@/app/adminPanel/orders/components/TrackingForm";

const OrderStatusView = ({tracking, setShowOrderStatusView}: {
    tracking: Tracking | null,
    setShowOrderStatusView: any
}) => {
    return (
        <DropShadow>
            <section className="bg-white relative rounded p-4">
                <div>
                    {tracking == null ? (<TrackingForm/>) : (
                        <div className="mt-5">
                        <h2 className="text-lg font-bold tracking-wide md:text-xl">Status</h2>
                        <select className="mt-5">
                            
                        </select>
                    </div>)}
                </div>

                <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition">
                    <button onClick={() => setShowOrderStatusView(false)}>
                        <IoClose size={24}/>
                    </button>
                </div>
            </section>
        </DropShadow>
    );
};

export default OrderStatusView;