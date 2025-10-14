import React, {useEffect, useState} from 'react';
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
import {getOrders, setPage, setSelectedOrder, setSize} from '@/lib/ordersSlice/ordersSlice';
import {IoInformationCircle, IoRefreshOutline, IoTrash} from "react-icons/io5";
import EmptyState from "@/app/components/EmptyState";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import {Customer, OrderItem, Tracking} from "@/interfaces";
import CustomerFormDialog from "@/app/dashboard/orders/components/CustomerFormDialog";
import ItemsFormDialog from "@/app/dashboard/orders/components/ItemsFormDialog";
import TrackingFormDialog from "@/app/dashboard/orders/components/TrackingFormDialog";
import PaymentStatusFormDialog from "@/app/dashboard/orders/components/PaymentStatusFormDialog";
import PaymentSummeryForm from "@/app/dashboard/orders/components/PaymentSummeryForm";
import {useConfirmationDialog} from "@/contexts/ConfirmationDialogContext";
import {deleteOrderAction} from "@/actions/ordersActions";
import {useSnackbar} from "@/contexts/SnackBarContext";

const OrderTable = () => {
    const {orders, size, selectedPage, isLoading} = useAppSelector(state => state.ordersSlice);
    const {currentUser, loading} = useAppSelector(state => state.authSlice);
    const {showConfirmation} = useConfirmationDialog();
    const {showNotification} = useSnackbar();

    const [customer, setCustomer] = useState<Customer | null>(null)
    const [showCustomerForm, setShowCustomerForm] = useState(false)

    const [showItemsForm, setShowItemsForm] = useState(false)
    const [orderItems, setOrderItems] = useState<OrderItem []>([])

    const [showPaymentStatusForm, setShowPaymentStatusForm] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState(null)

    const [showPaymentSummery, setShowPaymentSummery] = useState(false)

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (currentUser) {
            dispatch(getOrders({size, page: selectedPage}));
        }
    }, [currentUser, selectedPage, size, loading, dispatch]);

    const deleteOrder = (id:string) => {
        showConfirmation({
            title: "Delete Order",
            message: "Are you sure you want to delete this order?",
            onClose: () => {},
            onSuccess: async () => {
                try {
                    await deleteOrderAction(id)
                    dispatch(getOrders({size, page: selectedPage}))
                }catch (e) {
                   showNotification(e.message, "error")
                }
            }
        })
    }
    return (
        <Stack direction={"column"} gap={5}>
            <TableContainer component={Paper} sx={{
                position: "relative",
                borderRadius: 2,
                boxShadow: 2,
                overflow: "hidden"
            }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <Typography variant="h6" component="div" sx={{padding: 2}}>
                        Orders
                    </Typography>
                    <IconButton
                        color={"primary"}
                        onClick={() => dispatch(getOrders({size, page: selectedPage}))}>
                        <IoRefreshOutline />
                    </IconButton>
                </Box>
                <Table
                    sx={{
                        minWidth: 650,
                        "& thead": {
                            backgroundColor: "#f5f5f5",
                            "& th": {
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                fontSize: "0.875rem"
                            }
                        },
                        "& tbody tr:nth-of-type(odd)": {
                            backgroundColor: "#fafafa"
                        },
                        "& tbody tr:hover": {
                            backgroundColor: "#f0f0f0"
                        }
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Method</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>Tracking</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Action</TableCell>
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
                                        <IconButton onClick={() => {
                                            setCustomer(order?.customer)
                                            setShowCustomerForm(true)
                                            dispatch(setSelectedOrder(order))
                                        }
                                        }>
                                            <IoInformationCircle color={"blue"} size={25}/>
                                        </IconButton>
                                    </Box>
                                ) : "N/A"}</TableCell>
                                <TableCell>{order.paymentMethod}</TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography
                                            sx={{
                                                textTransform:"uppercase"
                                            }}
                                        >
                                            LKR {order.items.reduce(
                                            (sum, item) =>
                                                sum + item.price * item.quantity,
                                            0
                                        ) - (order?.discount || 0) + (order?.fee || 0) + (order?.shippingFee || 0)}
                                        </Typography>
                                        <IconButton onClick={() => {
                                            dispatch(setSelectedOrder(order))
                                            setShowPaymentSummery(true)
                                        }}>
                                            <IoInformationCircle color={"blue"} size={25}/>
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography>{order.paymentStatus}</Typography>
                                        <IconButton onClick={() => {
                                            setPaymentStatus(order?.paymentStatus)
                                            setShowPaymentStatusForm(true)
                                            dispatch(setSelectedOrder(order))
                                        }}>
                                            <IoInformationCircle color={"blue"} size={25}/>
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Stack direction={"row"} justifyItems={"center"} alignItems={"center"}>
                                        <Typography>
                                            {order.items.length}
                                        </Typography>
                                        <IconButton onClick={() => {
                                            setOrderItems(order.items)
                                            setShowItemsForm(true)
                                        }}>
                                            <IoInformationCircle color={"blue"} size={25}/>
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    {order.from}
                                </TableCell>
                                <TableCell>
                                    {order.createdAt}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => deleteOrder(order.orderId)}>
                                        <IoTrash color={"red"} size={25}/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {(orders.length === 0 && !isLoading) && (
                    <EmptyState
                        title={"No Orders"}
                        subtitle={"No orders available."}
                    />
                )}
                {isLoading && (
                    <ComponentsLoader position={"absolute"} title={"Loading Orders"}/>
                )}
            </TableContainer>
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
            <CustomerFormDialog customer={customer} showForm={showCustomerForm} onClose={() => {
                setShowCustomerForm(false)
                setCustomer(null)
                dispatch(setSelectedOrder(null))
            }}/>
            <ItemsFormDialog
                items={orderItems}
                showItemForm={showItemsForm}
                onClose={() => {
                    setShowItemsForm(false)
                    setOrderItems([])
                }}
            />
            <PaymentStatusFormDialog showForm={showPaymentStatusForm} onClose={() => {
                setPaymentStatus(null)
                setShowPaymentStatusForm(false)
                dispatch(setSelectedOrder(null))
            }} initialStatus={paymentStatus}/>
            <PaymentSummeryForm showForm={showPaymentSummery} onClose={() => {
                setShowPaymentSummery(false)
                dispatch(setSelectedOrder(null))
            }}/>
        </Stack>
    );
};

export default OrderTable;