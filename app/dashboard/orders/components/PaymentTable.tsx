import React, {useEffect} from 'react';
import {
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
import {IoPencil} from "react-icons/io5";
import EmptyState from "@/app/components/EmptyState";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import {PaymentMethod} from "@/interfaces";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getPayments} from '@/lib/ordersSlice/ordersSlice';

const PaymentTable = ({onClick}: { onClick: (payment: PaymentMethod) => void }) => {
    const dispatch:AppDispatch = useDispatch();
    const {payments, isPaymentLoading} = useSelector((state: RootState) => state.ordersSlice);
    const {currentUser} = useSelector((state: RootState) => state.authSlice);

    useEffect(() => {
        if (currentUser) {
            dispatch(getPayments());
        }
    }, [currentUser]);

    return (
        <Stack>
            <TableContainer component={Paper} sx={{
                position: "relative"
            }}>
                <Typography variant="h6" component="div" sx={{padding: 2}}>
                    Orders
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Payment ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Fee(%)</TableCell>
                            <TableCell>Available</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Updated At</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment: PaymentMethod) => (
                            <TableRow key={payment.paymentId}>
                                <TableCell>{payment.paymentId.toUpperCase()}</TableCell>
                                <TableCell>{payment.name}</TableCell>
                                <TableCell>{payment.fee}</TableCell>
                                <TableCell>{payment.available.toString()}</TableCell>
                                <TableCell>{payment.status}</TableCell>
                                <TableCell>
                                    {payment.createdAt}
                                </TableCell>
                                <TableCell>
                                    {payment.updatedAt}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => onClick(payment)}>
                                        <IoPencil/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {(payments.length === 0 && !isPaymentLoading) && (
                    <EmptyState
                        title={"No Payment Method"}
                        subtitle={"No payment methods available."}
                    />
                )}
                {isPaymentLoading && (
                    <ComponentsLoader position={"absolute"} title={"Loading payment methods"}/>
                )}
            </TableContainer>
        </Stack>
    );
};

export default PaymentTable;