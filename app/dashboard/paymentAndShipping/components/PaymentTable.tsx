import React, {useEffect, useState} from 'react';
import {
    Box,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {IoAdd, IoPencil, IoRefreshOutline} from "react-icons/io5";
import EmptyState from "@/app/components/EmptyState";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import {PaymentMethod} from "@/model";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getPayments, setSelectedPayment} from '@/lib/ordersSlice/ordersSlice';
import {useConfirmationDialog} from "@/contexts/ConfirmationDialogContext";
import PaymentMethodForm from "@/app/dashboard/paymentAndShipping/components/PaymentMethodForm";

const PaymentTable = () => {
    const dispatch: AppDispatch = useDispatch();
    const {payments, isPaymentLoading} = useSelector((state: RootState) => state.ordersSlice);
    const {currentUser} = useSelector((state: RootState) => state.authSlice);
    const {showConfirmation} = useConfirmationDialog();
    const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false)

    useEffect(() => {
        if (currentUser) {
            dispatch(getPayments());
        }
    }, [currentUser]);


    const onEdit = (payment: PaymentMethod) => {
        showConfirmation({
            title: "Edit Payment Method",
            message: "Editing a payment method has some serious consequences. Are you sure you want to edit this payment method?",
            onSuccess: () => {
                dispatch(setSelectedPayment(payment))
                setShowPaymentMethodForm(true)
            }
        })
    }

    return (
        <Stack>
            <TableContainer component={Paper} sx={{position: "relative", borderRadius: 2, overflow: "hidden"}}>
                <Stack
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <Typography variant="h6" component="div"
                                    sx={{padding: 2, fontWeight: "bold", borderBottom: "1px solid #ddd"}}>
                            Payment Methods
                        </Typography>
                        <IconButton
                            color={"primary"}
                            onClick={() => dispatch(getPayments())}
                        >
                            <IoRefreshOutline/>
                        </IconButton>
                    </Box>
                    <IconButton
                        onClick={() => setShowPaymentMethodForm(true)}
                        color={"primary"}
                    >
                        <IoAdd/>
                    </IconButton>
                </Stack>
                <Table sx={{minWidth: 800}}>
                    <TableHead>
                        <TableRow sx={{backgroundColor: "#f4f6f8"}}>
                            <TableCell sx={{fontWeight: "bold"}}>Payment ID</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Name</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Description</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Fee(%)</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Available</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Status</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Created At</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Updated At</TableCell>
                            <TableCell sx={{fontWeight: "bold"}}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment: PaymentMethod) => (
                            <TableRow key={payment.paymentId} sx={{
                                "&:nth-of-type(odd)": {backgroundColor: "#fafafa"},
                                "&:hover": {backgroundColor: "#f0f0f0"},
                                transition: "background-color 0.2s ease-in-out"
                            }}>
                                <TableCell>{payment.paymentId.toUpperCase()}</TableCell>
                                <TableCell>{payment.name}</TableCell>
                                <TableCell>{payment?.description || "-"}</TableCell>
                                <TableCell>{payment.fee}</TableCell>
                                <TableCell>{payment.available.toString()}</TableCell>
                                <TableCell>{payment.status}</TableCell>
                                <TableCell>{payment.createdAt}</TableCell>
                                <TableCell>{payment.updatedAt}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => onEdit(payment)} sx={{color: "#1976d2"}}>
                                        <IoPencil/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {(payments.length === 0 && !isPaymentLoading) && (
                    <EmptyState title={"No Payment Methods"} subtitle={"No payment methods available."}/>
                )}
                {isPaymentLoading && (
                    <ComponentsLoader position={"absolute"} title={"Loading payment methods"}/>
                )}
            </TableContainer>
            {showPaymentMethodForm && (<PaymentMethodForm
                showPaymentMethodForm={showPaymentMethodForm}
                onClose={() => {
                    setShowPaymentMethodForm(false)
                    dispatch(setSelectedPayment(null))
                }}
            />)}
        </Stack>
    );
};

export default PaymentTable;
