"use client";

import React, {useEffect, useState} from "react";
import DashboardCard from "../shared/DashboardCard";
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    timelineOppositeContentClasses,
    TimelineSeparator,
} from "@mui/lab";
import {CircularProgress, Typography} from "@mui/material";
import {collection, limit, onSnapshot, orderBy, query, where} from "@firebase/firestore";
import {db} from "@/firebase/firebaseClient";
import {Order} from "@/interfaces";
import {useSnackbar} from "@/contexts/SnackBarContext";

const RecentTransactions = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const {showNotification} = useSnackbar();
    useEffect(() => {
        try {
            const ordersRef = collection(db, "orders");
            const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"), limit(6));

            const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
                const ordersData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    createdAt: doc.data().createdAt.toDate().toLocaleString(),
                }));
                setOrders(ordersData);
                setLoading(false);
            });
            return () => unsubscribe();
        } catch (e) {
            console.error(e);
            showNotification(e.message, "error");
        }
    }, []);

    return (
        <DashboardCard title="Recent Orders">
            {loading ? (
                <CircularProgress sx={{display: "block", margin: "20px auto"}}/>
            ) : orders.length === 0 ? (
                <Typography variant="body2" sx={{textAlign: "center", padding: "20px"}}>
                    No recent orders available.
                </Typography>
            ) : (
                <Timeline
                    className="theme-timeline"
                    sx={{
                        p: 0,
                        mb: "-20px",
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
                                    {order.createdAt}
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
                                <TimelineConnector/>
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography fontWeight="600">Order #{order.orderId}</Typography>
                                <Typography variant="body2">
                                    {order?.customer?.name || "Not Available"} - {order.paymentStatus}
                                </Typography>
                                <Typography variant="body2">
                                    Total:
                                    LKR {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                                </Typography>
                                <Typography variant="body2">
                                    Discount: LKR {(order?.discount || 0).toFixed(2)}
                                </Typography>
                                <Typography variant="h6">
                                    Subtotal:
                                    LKR {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) - (order?.discount | 0)}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            )}
        </DashboardCard>
    );
};
export const dynamic = 'force-dynamic';
export default RecentTransactions;
