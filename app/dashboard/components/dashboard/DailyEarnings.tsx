"use client";

import {Box, CircularProgress, Typography} from "@mui/material";
import DashboardCard from "../shared/DashboardCard";
import {useEffect, useState} from "react";
import {collection, getDocs, query, Timestamp, where} from "@firebase/firestore";
import {db} from "@/firebase/firebaseClient";
import {Order} from "@/interfaces"; // Ensure the correct path to your interfaces

const DailyEarnings = () => {
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [invoiceCount, setInvoiceCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [totalProfit, setTotalProfit] = useState(0);
    // Add loading state

    useEffect(() => {
        const fetchDailyEarnings = async () => {
            try {
                // Get today's start and end timestamps
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);

                const startTimestamp = Timestamp.fromDate(startOfDay);

                // Query Firestore for today's orders
                const ordersRef = collection(db, "orders");
                const todayOrdersQuery = query(ordersRef, where("createdAt", ">=", startTimestamp));

                const querySnapshot = await getDocs(todayOrdersQuery);

                // Calculate total earnings and invoice count
                let earnings = 0;
                let count = 0;

                querySnapshot.forEach((doc) => {
                    const data = doc.data() as Order;

                    if (Array.isArray(data.items)) {
                        earnings += data.items.reduce((acc, item) => acc + (item.price || 0), 0);
                        count += 1;
                    }
                });

                setTotalEarnings(earnings);
                setInvoiceCount(count);
            } catch (error) {
                console.error("Error fetching daily earnings:", error.message, error.stack);
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };

        fetchDailyEarnings();
    }, []);

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
                        flexDirection: "column", // Use flexDirection instead of direction
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
                            <span>Profit: </span> LKR {totalProfit}
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
