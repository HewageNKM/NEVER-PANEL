"use client";

import {Box, CircularProgress, Typography} from "@mui/material";
import DashboardCard from "../shared/DashboardCard";
import {useEffect, useState} from "react";
import {collection, getDocs, query, Timestamp, where, doc, getDoc} from "@firebase/firestore";
import {db} from "@/firebase/firebaseClient";
import {Item, Order} from "@/interfaces";
import {useAppSelector} from "@/lib/hooks"; // Ensure the correct path to your interfaces

const DailyEarnings = () => {
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [invoiceCount, setInvoiceCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const {currentUser} = useAppSelector(state => state.authSlice);

    useEffect(() => {
        const fetchDailyEarnings = async () => {
            try {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);

                const startTimestamp = Timestamp.fromDate(startOfDay);

                const ordersRef = collection(db, "orders");
                const todayOrdersQuery = query(ordersRef, where("createdAt", ">=", startTimestamp), where("paymentStatus", "==", "Paid"));

                const querySnapshot = await getDocs(todayOrdersQuery);

                let earnings = 0;
                let buyingCost = 0;
                let count = 0;

                for (const docSnap of querySnapshot.docs) {
                    const data = docSnap.data() as Order;

                    if (Array.isArray(data.items)) {
                        for (const item of data.items) {
                            earnings += item.price || 0;

                            // Fetch buying price from inventory
                            if (item.itemId) {
                                const inventoryDocRef = doc(db, "inventory", item.itemId);
                                const inventoryDoc = await getDoc(inventoryDocRef);

                                if (inventoryDoc.exists()) {
                                    const inventoryData = inventoryDoc.data() as Item;
                                    buyingCost += (inventoryData.buyingPrice || 0) * (item.quantity || 1);
                                }
                            }
                        }
                        count += 1;
                    }
                }

                const profit = earnings - buyingCost;

                setTotalEarnings(earnings);
                setTotalProfit(profit);
                setInvoiceCount(count);
            } catch (error) {
                console.error("Error fetching daily earnings:", error.message, error.stack);
            } finally {
                setLoading(false);
            }
        };

        fetchDailyEarnings();
    }, [currentUser]);

    return (
        <DashboardCard
            title="Daily Earnings"
        >
            {loading ? (
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100px"}}>
                    <CircularProgress/>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Box mt={2} sx={{
                        display: "flex",
                        gap: 3,
                        flexDirection: "column"
                    }}>
                        <Typography variant="h4" fontWeight="700" mt="-20px">
                            <span>Total Sale: </span> LKR {totalEarnings.toLocaleString()}
                        </Typography>
                        <Typography variant="h4" fontWeight="700" mt="-20px">
                            <span>Profit: </span> LKR {totalProfit.toLocaleString()}
                        </Typography>
                        <Typography variant="h4" fontWeight="700" mt="-20px">
                            <span>Invoices: </span> {invoiceCount}
                        </Typography>
                    </Box>
                </Box>
            )}
        </DashboardCard>
    );
};

export const dynamic = 'force-dynamic';
export default DailyEarnings;
