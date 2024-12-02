import React, { useEffect, useState } from 'react';
import { Select, MenuItem, Box, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../shared/DashboardCard';
import dynamic from "next/dynamic";
import { collection, query, where, getDocs, Timestamp } from "@firebase/firestore";
import { db } from "@/firebase/firebaseClient"; // Ensure the correct path
import { Order } from "@/interfaces"; // Ensure the correct path

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesOverview = () => {
    const [month, setMonth] = useState<string>('');
    const [salesData, setSalesData] = useState({ website: [], store: [] });
    const [loading, setLoading] = useState(true);
    const [months, setMonths] = useState<string[]>([]);

    const handleChange = (event: any) => {
        setMonth(event.target.value);
    };

    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    // chart options
    const optionscolumnchart: any = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            },
            height: 370,
        },
        colors: [primary, secondary],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },
        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            tickAmount: 4,
        },
        xaxis: {
            categories: [],
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: 'dark',
            fillSeriesColor: false,
        },
    };

    // Placeholder for chart data
    const seriescolumnchart: any = [
        {
            name: 'Earnings this month (Website)',
            data: salesData.website,
        },
        {
            name: 'Earnings this month (Store)',
            data: salesData.store,
        },
    ];

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                setLoading(true);

                // Get the first day and last day of the current month
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
                    where("createdAt", "<=", endTimestamp)
                );

                const querySnapshot = await getDocs(ordersQuery);

                if (querySnapshot.empty) {
                    console.log('No matching documents found.');
                } else {
                    console.log('Found documents:', querySnapshot.size);
                }

                querySnapshot.forEach((doc) => {
                    console.log('Document data:', doc.data()); // Log each document's data
                });

                // Continue with the processing logic...
            } catch (error) {
                console.error("Error fetching sales data:", error.message, error.stack);
            } finally {
                setLoading(false);
            }
        };
        fetchSalesData();
    }, [month]);

    return (
        <DashboardCard
            title="Sales Overview"
            action={
                <Select
                    labelId="month-dd"
                    id="month-dd"
                    value={month}
                    size="small"
                    onChange={handleChange}
                    disabled={loading || !months.length}
                >
                    {months.map((monthYear) => {
                        const [year, monthIndex] = monthYear.split('-');
                        const monthName = new Date(parseInt(year), parseInt(monthIndex) - 1).toLocaleString('default', { month: 'long' });
                        return (
                            <MenuItem key={monthYear} value={monthYear}>
                                {monthName} {year}
                            </MenuItem>
                        );
                    })}
                </Select>
            }
        >
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Chart
                    options={optionscolumnchart}
                    series={seriescolumnchart}
                    type="bar"
                    height={370}
                    width={"100%"}
                />
            )}
        </DashboardCard>
    );
};

export default SalesOverview;
