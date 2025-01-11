import React, {useEffect, useState} from "react";
import {Box, CircularProgress} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import DashboardCard from "../shared/DashboardCard";
import dynamic from "next/dynamic";
import {collection, getDocs, query, Timestamp, where} from "@firebase/firestore";
import {db} from "@/firebase/firebaseClient";
import {useAppSelector} from "@/lib/hooks";

const Chart = dynamic(() => import("react-apexcharts"), {ssr: false});

const SalesOverview = () => {
    const [loading, setLoading] = useState(true);
    const [salesData, setSalesData] = useState({website: Array(12).fill(0), store: Array(12).fill(0)});
    const [months, setMonths] = useState<string[]>(Array.from({length: 12}, (_, i) =>
        new Date(0, i).toLocaleString("default", {month: "short"})
    ));

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

            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);
            endOfMonth.setDate(0);
            endOfMonth.setHours(23, 59, 59, 999);

            const startTimestamp = Timestamp.fromDate(startOfMonth);
            const endTimestamp = Timestamp.fromDate(endOfMonth);

            const ordersRef = collection(db, "orders");
            const ordersQuery = query(
                ordersRef,
                where("createdAt", ">=", startTimestamp),
                where("createdAt", "<=", endTimestamp),
                where("paymentStatus", "==", "Paid")
            );

            const querySnapshot = await getDocs(ordersQuery);

            const websiteOrders: number[] = new Array(12).fill(0);
            const storeOrders: number[] = new Array(12).fill(0);

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const createdAt = data.createdAt?.toDate();
                if (createdAt) {
                    const monthIndex = createdAt.getMonth();
                    if (data.from.toString().toLowerCase() === "website") {
                        websiteOrders[monthIndex]++;
                    } else if (data.from.toString().toLowerCase() === "store") {
                        storeOrders[monthIndex]++;
                    }
                }
            });

            setSalesData({website: websiteOrders, store: storeOrders});

            const monthLabels = Array.from({length: 12}, (_, i) =>
                new Date(0, i).toLocaleString("default", {month: "short"})
            );
            setMonths(monthLabels);
        } catch (error) {
            console.error("Error fetching sales data:", error.message);
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