"use client";
import {Box, CircularProgress, Typography} from "@mui/material";
import DashboardCard from "../shared/DashboardCard";
import {useEffect, useState} from "react";
import {useAppSelector} from "@/lib/hooks";
import {getDailyOverview} from "@/actions/reportsAction"; // Ensure the correct path to your interfaces

const DailyEarnings = () => {
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [invoiceCount, setInvoiceCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const {currentUser} = useAppSelector(state => state.authSlice);

    useEffect(() => {
        if (currentUser) {
            fetchDailyEarnings();
        }
    }, [currentUser]);

    const fetchDailyEarnings = async () => {
        try {
            const overview = await getDailyOverview();
            setTotalEarnings(overview.totalEarnings);
            setTotalProfit(overview.totalProfit);
            setInvoiceCount(overview.invoiceCount);
        } catch (error) {
            console.error("Error fetching daily earnings:", error.message, error.stack);
        } finally {
            setLoading(false);
        }
    };
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
