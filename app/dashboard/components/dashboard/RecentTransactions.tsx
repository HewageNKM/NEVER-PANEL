"use client";

import React, { useEffect, useState } from "react";
import DashboardCard from "../shared/DashboardCard";
import {
    Timeline,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent,
    timelineOppositeContentClasses,
} from "@mui/lab";
import { Typography, Link, CircularProgress } from "@mui/material";
import { collection, onSnapshot, query, orderBy, limit } from "@firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { Order } from "@/interfaces";

const RecentTransactions = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ordersRef = collection(db, "orders");
        const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"), limit(6));

        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
            const ordersData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOrders(ordersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <DashboardCard title="Recent Orders">
            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : orders.length === 0 ? (
                <Typography variant="body2" sx={{ textAlign: "center", padding: "20px" }}>
                    No recent orders available.
                </Typography>
            ) : (
                <Timeline
                    className="theme-timeline"
                    sx={{
                        p: 0,
                        mb: "-40px",
                        "& .MuiTimelineConnector-root": {
                            width: "1px",
                            backgroundColor: "#efefef",
                        },
                        [`& .${timelineOppositeContentClasses.root}`]: {
                            flex: 0.5,
                            paddingLeft: 0,
                        },
                    }}
                >
                    {orders.map((order: Order) => (
                        <TimelineItem key={order.orderId}>
                            <TimelineOppositeContent>
                                <Typography variant="body2">
                                    {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}{" "}
                                    {new Date(order.createdAt.seconds * 1000).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Typography>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot
                                    color={
                                        order.paymentStatus === "Paid"
                                            ? "success"
                                            : order.paymentStatus === "Pending"
                                                ? "warning"
                                                : "error"
                                    }
                                    variant="outlined"
                                />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography fontWeight="600">Order #{order.orderId}</Typography>
                                <Typography variant="body2">
                                    {order?.customer?.name || "Not Available"} - {order.paymentStatus}
                                </Typography>
                                <Typography variant="body2">
                                    Total: LKR {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                                </Typography>
                                <Link href={`/orders/${order.orderId}`} underline="none">
                                    View Details
                                </Link>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            )}
        </DashboardCard>
    );
};

export default RecentTransactions;
