import React from 'react';
import Hero from "@/app/adminPanel/orders/components/Hero";
import Orders from "@/app/adminPanel/orders/components/Orders";
import {getOrders} from "@/firebase/firebaseAdmin";

const Page = async () => {
    let orders = await getOrders();
    orders.map(order => {
        order.createdAt = order.createdAt.toDate();
        order.updatedAt = order.updatedAt.toDate();
    })
    orders = orders.filter(order => order.paymentStatus !== "Failed");
    return (
        <main className="w-full h-full">
            <div className="mt-24">
                <h1 className="text-2xl font-bold px-8">Orders</h1>
                <div className="overflow-auto flex flex-col">
                    <Hero/>
                    <Orders orders={orders}/>
                </div>
            </div>
        </main>
    );
};

export default Page;
