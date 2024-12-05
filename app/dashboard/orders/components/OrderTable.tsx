import React, {useEffect} from 'react';
import {
    Box,
    IconButton,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {getOrders, setPage, setSize} from '@/lib/ordersSlice/ordersSlice';
import {IoInformation, IoInformationCircle} from "react-icons/io5";
import EmptyState from "@/app/components/EmptyState";
import ComponentsLoader from "@/app/components/ComponentsLoader";

const OrderTable = () => {
    const {orders, size, selectedPage, isLoading} = useAppSelector(state => state.ordersSlice);
    const {currentUser, loading} = useAppSelector(state => state.authSlice);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (currentUser) {
            setTimeout(() => {
                dispatch(getOrders({size, page: selectedPage}));
            }, 1000);
        }
    }, [currentUser, selectedPage, size, loading, dispatch]);
    return (
        <Stack direction={"column"} gap={5}>
            <TableContainer component={Paper}>
                <Typography variant="h6" component="div" sx={{padding: 2}}>
                    Orders
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Payment Status</TableCell>
                            <TableCell>Payment Method</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Shipping Cost</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>Created At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.orderId}>
                                <TableCell>#{order.orderId}</TableCell>
                                <TableCell>{order.customer ? (
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyItems: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <Typography>
                                            {order.customer.name}
                                        </Typography>
                                        <IconButton>
                                            <IoInformation size={20}/>
                                        </IconButton>
                                    </Box>
                                ) : "Not Available"}</TableCell>
                                <TableCell>{order.paymentStatus}</TableCell>
                                <TableCell>{order.paymentMethod}</TableCell>
                                <TableCell>
                                    LKR {order.items.reduce(
                                    (sum, item) =>
                                        sum + item.price * item.quantity,
                                    0
                                )}
                                </TableCell>
                                <TableCell>
                                    LKR {order.shippingCost}
                                </TableCell>
                                <TableCell>
                                    <Stack direction={"row"} justifyItems={"center"} alignItems={"center"}>
                                        <Typography>
                                            {order.items.length}
                                        </Typography>
                                        <IconButton>
                                            <IoInformationCircle color={"blue"} size={20}/>
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    {order.from}
                                </TableCell>
                                <TableCell>
                                    {order.createdAt}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {(orders.length === 0 && !isLoading) && (
                <EmptyState
                    title={"No Orders"}
                    subtitle={"No orders available."}
                />
            )}
            {isLoading && (
                <ComponentsLoader title={"Loading Orders"} />
            )}
            <Box
                mt={2}
                gap={1}
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
            >
                <Select variant="outlined" size="small" defaultValue={size}
                        onChange={(event) => dispatch(setSize(Number.parseInt(event.target.value)))}>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>
                <Pagination count={10} variant="outlined" shape="rounded"
                            onChange={(event, page) => dispatch(setPage(page))}/>
            </Box>
        </Stack>
    );
};

export default OrderTable;