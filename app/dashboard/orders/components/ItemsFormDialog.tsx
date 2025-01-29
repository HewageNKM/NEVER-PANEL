import React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import {OrderItem} from "@/interfaces";
import {Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

const ItemsFormDialog = ({items, showItemForm, onClose}: {
    items: OrderItem[] | [],
    showItemForm: boolean,
    onClose: () => void
}) => {
    return (
        <Dialog open={showItemForm} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Items Details</DialogTitle>
            <DialogContent>
                <Stack
                    sx={{
                        padding: "16px",
                    }}
                >
                    <TableContainer
                        sx={{ borderRadius: 2, border: "1px solid #ddd" }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow sx={{backgroundColor: "#f5f5f5"}}>
                                    <TableCell sx={{fontWeight: "bold"}}>Item</TableCell>
                                    <TableCell sx={{fontWeight: "bold"}} align="right">Quantity</TableCell>
                                    <TableCell sx={{fontWeight: "bold"}} align="right">Price (LKR)</TableCell>
                                    <TableCell sx={{fontWeight: "bold"}} align="right">Total (LKR)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.length > 0 ? (
                                    items.map((item: OrderItem, index: number) => (
                                        <TableRow key={index} hover sx={{"&:hover": {backgroundColor: "#f9f9f9"}}}>
                                            <TableCell>{item.name} / {item.variantName} / {item.size}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">{item.price.toFixed(2)}</TableCell>
                                            <TableCell
                                                align="right">{(item.price * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{color: "gray", padding: "16px"}}>
                                            No items available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
                <div style={{marginTop: "16px", display: "flex", justifyContent: "flex-end"}}>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ItemsFormDialog;
