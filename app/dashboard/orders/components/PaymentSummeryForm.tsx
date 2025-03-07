import React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import EmptyState from "@/app/components/EmptyState";

const PaymentSummeryForm = ({ showForm, onClose }: { showForm: boolean; onClose: () => void }) => {
    const { selectedOrder } = useSelector((state: RootState) => state.ordersSlice);

    return (
        <Dialog open={showForm} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Payment Summary</DialogTitle>
            <DialogContent>
                <Stack direction="column" mt={1} spacing={2}>
                    <TableContainer sx={{ borderRadius: 2, border: "1px solid #ddd" }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell sx={{ textAlign: "right" }}>
                                        LKR {selectedOrder?.items.reduce((acc, item) => acc + item.price, 0)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Shipping Fee</TableCell>
                                    <TableCell sx={{ textAlign: "right" }}>
                                        LKR {selectedOrder?.shippingFee || 0}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Fee</TableCell>
                                    <TableCell sx={{ textAlign: "right" }}>
                                        LKR {selectedOrder?.fee || 0}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Discount</TableCell>
                                    <TableCell sx={{ textAlign: "right", color: "red" }}>
                                        -LKR {selectedOrder?.discount || 0}
                                    </TableCell>
                                </TableRow>
                                <TableRow sx={{ backgroundColor: "#f9f9f9", fontWeight: "bold" }}>
                                    <TableCell>Sub Total</TableCell>
                                    <TableCell sx={{ textAlign: "right", fontWeight: "bold" }}>
                                        LKR {selectedOrder?.items.reduce((acc, item) => acc + item.price, 0) +
                                        (selectedOrder?.shippingFee || 0) +
                                        (selectedOrder?.fee || 0) -
                                        (selectedOrder?.discount || 0)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                        Payment Received
                    </Typography>

                    <TableContainer sx={{ borderRadius: 2, border: "1px solid #ddd" }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Card</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedOrder?.paymentReceived?.length ? (
                                    selectedOrder.paymentReceived.map((payment) => (
                                        <TableRow key={payment.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fcfcfc" } }}>
                                            <TableCell>{payment.id}</TableCell>
                                            <TableCell sx={{
                                                textTransform: "uppercase"
                                            }}>{payment.paymentMethod}</TableCell>
                                            <TableCell>{payment?.cardNumber || "N/A"}</TableCell>
                                            <TableCell sx={{ textAlign: "right" }}>LKR {payment.amount}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <EmptyState title="No Payment data" subtitle="No payment data available for this order" />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>

                <CardActions sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                    <Button size="small" color="primary" variant="contained" onClick={onClose}>
                        Close
                    </Button>
                </CardActions>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentSummeryForm;
