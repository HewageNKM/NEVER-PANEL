"use client"
import React, {useState} from 'react';
import {Box, IconButton, Stack, Typography} from "@mui/material";
import {IoAdd, IoRefreshCircle} from "react-icons/io5";
import PaymentTable from "@/app/dashboard/paymentAndShipping/components/PaymentTable";
import {PaymentMethod} from "@/interfaces";
import {getPayments, setSelectedPayment} from "@/lib/ordersSlice/ordersSlice";
import PaymentMethodForm from "@/app/dashboard/paymentAndShipping/components/PaymentMethodForm";
import {useAppDispatch} from "@/lib/hooks";

const Header = () => {
    const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false)
    const dispatch = useAppDispatch();
    return (
        <Stack sx={{
            position: "relative",
            width: "100%",
            display: "flex",
        }}>
            <Stack>
               {/*// Todo */}
            </Stack>
            <Stack
                sx={{
                    width: "100%",
                    display: "flex",
                    gap: 2
                }}
            >
                <Stack
                    sx={{
                        display: "flex",
                        gap: 2,
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <Box
                        display={"flex"}
                        flexDirection={"row"}
                        justifyItems={"center"}
                        alignItems={"center"}
                        gap={2}
                    >
                        <IconButton
                            onClick={()=> dispatch(getPayments())}
                        >
                            <IoRefreshCircle
                                size={30}
                            />
                        </IconButton>
                    </Box>
                    <IconButton
                        onClick={() => setShowPaymentMethodForm(true)}
                    >
                        <IoAdd
                            size={30}
                            color={"#000"}
                        />
                    </IconButton>
                </Stack>
                <Stack>
                    <PaymentTable onClick={(payment: PaymentMethod) => {
                        dispatch(setSelectedPayment(payment))
                        setShowPaymentMethodForm(true)
                    }}/>
                </Stack>
            </Stack>
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

export default Header;