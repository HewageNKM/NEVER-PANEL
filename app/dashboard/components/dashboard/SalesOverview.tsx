import React, {useEffect, useState} from "react";
import {Box, CircularProgress} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import DashboardCard from "../shared/DashboardCard";
import dynamic from "next/dynamic";
import {collection, getDocs, query, Timestamp, where} from "@firebase/firestore";
import {db} from "@/firebase/firebaseClient";
import {useAppSelector} from "@/lib/hooks";
import {useSnackbar} from "@/contexts/SnackBarContext";

const Chart = dynamic(() => import("react-apexcharts"), {ssr: false});

const SalesOverview = () => {
    const [loading, setLoading] = useState(true);
    const [salesData, setSalesData] = useState({website: Array(12).fill(0), store: Array(12).fill(0)});
    const [months, setMonths] = useState<string[]>(Array.from({length: 12}, (_, i) =>
        new Date(0, i).toLocaleString("default", {month: "short"})
    ));
    const {showNotification} = useSnackbar();
    const {currentUser} = useAppSelector(state => state.authSlice);

    // Chart colors
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    const optionscolumnchart: any = {
        chart: {type: "bar", height: 370},
        colors: [primary, secondary],
        plotOptions: {
            bar: {horizontal: false, columnWidth: "42%", borderRadius: 6},
        },
        xaxis: {categories: months.length ? months : Array(12).fill("No Data")},
        yaxis: {tickAmount: 4},
        tooltip: {theme: "dark"},
    };

    const seriescolumnchart = [
        {
            name: "Website",
            data: salesData.website && salesData.website.length ? salesData.website : Array(12).fill(0),
        },
        {
            name: "Store",
            data: salesData.store && salesData.store.length ? salesData.store : Array(12).fill(0),
        },
    ];


    useEffect(() => {
        if (currentUser) {
            fetchSalesData();
        }
    }, [currentUser]);

    const fetchSalesData = async () => {
        try {
            setLoading(true);

            // Get the current year and month
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth(); // 0-based index (Jan = 0, Dec = 11)

            // Set the range from the beginning of the year to the current month
            const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);
            const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

            const startTimestamp = Timestamp.fromDate(startOfYear);
            const endTimestamp = Timestamp.fromDate(endOfMonth);

            const ordersRef = collection(db, "orders");
            const ordersQuery = query(
                ordersRef,
                where("createdAt", ">=", startTimestamp),
                where("createdAt", "<=", endTimestamp),
                where("paymentStatus", "in", ["Paid", "Pending"])
            );

            const querySnapshot = await getDocs(ordersQuery);

            // Initialize arrays to store monthly sales data
            const updatedWebsiteOrders = new Array(12).fill(0);
            const updatedStoreOrders = new Array(12).fill(0);

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const createdAt = data.createdAt?.toDate();
                if (createdAt) {
                    const monthIndex = createdAt.getMonth();
                    if (data.from.toString().toLowerCase() === "website") {
                        updatedWebsiteOrders[monthIndex]++;
                    } else if (data.from.toString().toLowerCase() === "store") {
                        updatedStoreOrders[monthIndex]++;
                    }
                }
            });
            setSalesData({ website: updatedWebsiteOrders, store: updatedStoreOrders });
        } catch (error) {
            console.error(error);
            showNotification(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardCard
            title="Sales Overview"
        >
            {loading ? (<Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100px"}}>
                <CircularProgress/>
            </Box>) : (<Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height={370}/>)}
        </DashboardCard>
    );
};

export default SalesOverview;