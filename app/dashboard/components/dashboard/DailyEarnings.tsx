"use client";

import { Box, Fab, Typography } from "@mui/material";
import { IconCurrencyDollar } from "@tabler/icons-react";
import DashboardCard from "../shared/DashboardCard";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, Timestamp } from "@firebase/firestore";
import {db} from "@/firebase/firebaseClient"; // Ensure the correct path to your Firebase configuration

const DailyEarnings = () => {
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [invoiceCount, setInvoiceCount] = useState(0);

    useEffect(() => {
        const fetchDailyEarnings = async () => {
            try {
                // Get today's start and end timestamps
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);

                const startTimestamp = Timestamp.fromDate(startOfDay);
                const endTimestamp = Timestamp.fromDate(endOfDay);

                // Query Firestore for today's orders
                const ordersRef = collection(db, "orders");
                const todayOrdersQuery = query(
                    ordersRef,
                    where("orderDate", ">=", startTimestamp),
                    where("orderDate", "<=", endTimestamp)
                );

                const querySnapshot = await getDocs(todayOrdersQuery);

                // Calculate total earnings and invoice count
                let earnings = 0;
                let count = 0;

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    earnings += data.amount || 0; // Ensure `amount` is the correct field for order total
                    count += 1;
                });
                setTotalEarnings(earnings);
                setInvoiceCount(count);
            } catch (error) {
                console.error("Error fetching daily earnings:", error);
            }
        };

        fetchDailyEarnings();
    }, []);

    return (
        <DashboardCard
            title="Daily Earnings"
            action={
                <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }}>
                    <IconCurrencyDollar width={24} />
                </Fab>
            }
        >
            <Box
                sx={{
                    display: "flex",
                    direction: "column",
                    gap: 2,
                }}
            >
                <Typography variant="h3" fontWeight="700" mt="-20px">
                    <span>Total: </span> ${totalEarnings.toLocaleString()}
                </Typography>
                <Typography variant="h3" fontWeight="700" mt="-20px">
                    <span>Invoices: </span> {invoiceCount}
                </Typography>
            </Box>
        </DashboardCard>
    );
};

export default DailyEarnings;
