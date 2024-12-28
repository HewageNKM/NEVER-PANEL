import React, {useEffect, useState} from 'react';
import {Box, Button, MenuItem, Select, Stack, TextField} from '@mui/material';
import HeaderCard from '@/app/dashboard/reports/components/HeaderCard';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {collection, doc, getDoc, getDocs, query, Timestamp, where} from "@firebase/firestore";
import {db} from "@/firebase/firebaseClient";
import {Item, Order} from "@/interfaces";
import {useAppSelector} from "@/lib/hooks";
import SaleReport from "@/app/dashboard/reports/components/SaleReport";
import {getReport} from "@/actions/ordersActions";

const Header = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedType, setSelectedType] = useState("")
    const [totalSale, setTotalSale] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [invoiceCount, setInvoiceCount] = useState(0);
    const {currentUser} = useAppSelector(state => state.authSlice);
    const [isLoading, setIsLoading] = useState(true)
    const [sales, setSales] = useState(null)
    const [showSaleReport, setShowSaleReport] = useState(false)

    const onSubmit = async (evt) => {
        evt.preventDefault();
        setIsLoading(true);
        if (selectedType !== "sale" && (toDate == null && fromDate == null)) {
            alert("Please fill all fields");
            return;
        }
        try {
            const startDate = fromDate?.toDate().toDateString();
            const endDate = toDate?.toDate().toDateString();

            const response = await getReport(startDate, endDate);
            if (response?.data?.data?.length == 0) {
                alert("No data found");
                return;
            } else {
                console.log(response.data)
                setSales(response.data.data)

                setShowSaleReport(true);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchMonthlyEarning = async () => {
        setIsLoading(true);
        try {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const endOfMonth = new Date();
            endOfMonth.setHours(23, 59, 59, 999);

            const endTimestamp = Timestamp.fromDate(endOfMonth);
            const startTimestamp = Timestamp.fromDate(startOfMonth);

            const ordersRef = collection(db, "orders");
            const todayOrdersQuery = query(ordersRef, where("createdAt", ">=", startTimestamp), where("createdAt", "<=", endTimestamp), where("paymentStatus", "==", "Paid"));

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

            setTotalSale(earnings);
            setTotalProfit(profit);
            setInvoiceCount(count);
        } catch (error) {
            console.error("Error fetching daily earnings:", error.message, error.stack);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMonthlyEarning()
    }, [currentUser]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack
                sx={{
                    position: 'relative',
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <Stack
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 3,
                        flexWrap: 'wrap',
                        justifyContent: 'space-evenly',
                        width: '100%',
                    }}
                >
                    <HeaderCard
                        invoices={invoiceCount}
                        isLoading={isLoading}
                        startDate={new Date(new Date().setDate(1)).toDateString()}
                        endDate={new Date().toDateString()}
                        title={'Sales'}
                        value={totalSale}
                    />
                    <HeaderCard
                        invoices={invoiceCount}
                        isLoading={isLoading}
                        startDate={new Date(new Date().setDate(1)).toDateString()}
                        endDate={new Date().toDateString()}
                        title={'Profit'}
                        value={totalProfit}
                    />
                </Stack>
                <form onSubmit={onSubmit}>
                    <Stack
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 3,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            width: '100%',
                            alignItems: 'center',
                        }}
                    >
                        <Box>
                            <Select
                                variant="outlined"
                                value={selectedType}
                                onChange={(event) => setSelectedType(event.target.value as string)}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select Type
                                </MenuItem>
                                <MenuItem value={"sale"}>Sale</MenuItem>
                                <MenuItem value={"stock"}>Stock</MenuItem>
                            </Select>

                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 3,
                            justifyContent: 'center',
                        }}>
                            <DatePicker
                                disabled={selectedType === "" || selectedType === "stock" || isLoading}
                                label="From"
                                value={fromDate}
                                onChange={(newValue) => setFromDate(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                                label="To"
                                disabled={selectedType === "" || selectedType === "stock" || isLoading}
                                value={toDate}
                                onChange={(newValue) => setToDate(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Box>
                        <Box>
                            <Button disabled={isLoading} className={"disabled:opacity-60 disabled:cursor-not-allowed"}
                                    type={"submit"} variant={"contained"}>
                                View Report
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Stack>
            <SaleReport sales={sales} setShow={() => setShowSaleReport(false)} show={showSaleReport}/>
        </LocalizationProvider>
    );
};

export default Header;
