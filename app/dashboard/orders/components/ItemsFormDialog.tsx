import React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { OrderItem } from "@/interfaces";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const ItemsFormDialog = ({ items, showItemForm, onClose }: {
    items: OrderItem[] | [],
    showItemForm: boolean,
    onClose: () => void
}) => {
    return (
        <Dialog open={showItemForm} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Items Details</DialogTitle>

            <DialogContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Item</strong></TableCell>
                                <TableCell align="right"><strong>Quantity</strong></TableCell>
                                <TableCell align="right"><strong>Price</strong></TableCell>
                                <TableCell align="right"><strong>Total</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.length > 0 ? (
                                items.map((item: OrderItem, index: number) => (
                                    <TableRow key={index} hover>
                                        <TableCell>{item.name} / {item.itemId} / {item.variantName} / {item.variantId}</TableCell>
                                        <TableCell align="right">{item.quantity}</TableCell>
                                        <TableCell align="right">{item.price.toFixed(2)}</TableCell>
                                        <TableCell align="right">{(item.price * item.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No items available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ItemsFormDialog;
