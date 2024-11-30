import {
    Box,
    Button,
    IconButton, MenuItem, Pagination,
    Paper, Select, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {getOrders, setPage, setSize} from "@/lib/ordersSlice/ordersSlice";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import EmptyState from "@/app/components/EmptyState";

const OrdersTable = () => {
    const {currentUser} = useAppSelector(state => state.authSlice);
    const {page, size, orders, loading} = useAppSelector(state => state.ordersSlice);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (currentUser) {
            dispatch(getOrders({page, size}));
        }
    }, [currentUser, page, size, dispatch]);

    return (
        <Stack>
            <TableContainer
                component={Paper}
                elevation={3}
                sx={{
                    marginTop: 2,
                    overflowX: 'auto', // Enable horizontal scrolling
                }}
            >
                {loading ? (<ComponentsLoader  title={"Loading Orders"}/>):(<Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {["Order ID", "Payment ID", "Payment Status", "Payment Method", "Total", "Shipping Cost", "Address", "Created At", "Location", "Status", "Actions"].map((header) => (
                                <TableCell key={header} sx={{fontWeight: 'bold', backgroundColor: '#f5f5f5'}}>
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.orderId} hover>
                                <TableCell>#{order.orderId}</TableCell>
                                <TableCell>{order.paymentId}</TableCell>
                                <TableCell>
                                    <Tooltip title={order.paymentStatus} arrow>
                                        <span>{order.paymentStatus}</span>
                                    </Tooltip>
                                    <IconButton
                                        color="primary"
                                        sx={{marginRight: 1}}
                                    >
                                        <InfoIcon/>
                                    </IconButton>
                                </TableCell>
                                <TableCell>{order.paymentMethod}</TableCell>
                                <TableCell>
                                    LKR {order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                                </TableCell>
                                <TableCell>LKR {order.shippingCost.toFixed(2)}</TableCell>
                                <TableCell>
                                    {order.customer ? order.customer.name : "Not Available"} {order.customer && (
                                    <IconButton
                                        color="primary"
                                        sx={{marginRight: 1}}
                                    >
                                        <InfoIcon/>
                                    </IconButton>
                                )}
                                </TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                <TableCell>{order.from}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                    >
                                        View
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                    >
                                        View Items
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>)}
                {orders.length === 0 && (
                    <EmptyState title={"No Orders"} subtitle={"Try adding some orders"}/>
                )}
            </TableContainer>
            <Box
                mt={3}
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
                </Select>
                <Pagination count={10} variant="outlined" shape="rounded"
                            onChange={(event, page) => dispatch(setPage(page))}/>
            </Box>
        </Stack>
    );
};

export default OrdersTable;
