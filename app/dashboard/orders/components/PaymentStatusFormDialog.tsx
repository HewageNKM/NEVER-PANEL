import React, {useEffect, useState} from 'react';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import {Box, FormControl, MenuItem, Select, Stack} from "@mui/material";
import {paymentStatus, paymentStatusList} from "@/constant";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import {PaymentStatus} from "@/functions/src/constant";
import {useAppSelector} from "@/lib/hooks";
import {Order} from "@/interfaces";
import {updatePaymentStatusOfOrder} from "@/actions/ordersActions";


const PaymentStatusFormDialog = ({initialStatus, showForm, onClose}: {
    initialStatus: string;
    showForm: boolean;
    onClose: () => void;
}) => {

    const {selectedOrder} = useAppSelector(state => state.ordersSlice);
    const updatePaymentStatus = async () => {
        try {
            setIsLoading(true);
            const updatedOrder: Order = {
                ...selectedOrder,
                paymentStatus: selectedStatus
            }
            await updatePaymentStatusOfOrder(updatedOrder);
            onClose();
        }catch (e) {
            console.log(e);
        }finally {
            setIsLoading(false);
        }
    }
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        setSelectedStatus(initialStatus);
    }, [initialStatus]);
    return (
        <Dialog open={showForm} onClose={onClose}>
            <DialogTitle>Payment Status</DialogTitle>
            <DialogContent>
                <Stack direction="column" mt={1} spacing={2}>
                    <FormControl sx={{marginTop: '2rem'}}>
                        <Select
                            labelId="payment-status-label"
                            value={selectedStatus}
                            onChange={(evt) => setSelectedStatus(evt.target.value as PaymentStatus)}
                            fullWidth
                        >
                            {paymentStatusList.map((status) => (
                                <MenuItem
                                    key={status.id}
                                    value={status.value}
                                    disabled={status.value === paymentStatus.REFUNDED && selectedStatus === paymentStatus.REFUNDED}
                                >
                                    {status.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                <CardActions sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '16px',
                    marginTop: '24px'
                }}>
                    <div style={{display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px'}}>
                        <Button className="disabled:bg-opacity-60 disabled:cursor-not-allowed"  disabled={isLoading} size="small" color="primary" onClick={onClose}>
                            Close
                        </Button>
                        <Button className="disabled:bg-opacity-60 disabled:cursor-not-allowed" disabled={selectedStatus == selectedOrder?.paymentStatus || isLoading} onClick={updatePaymentStatus} variant="contained" color="secondary">
                            Update
                        </Button>
                    </div>
                </CardActions>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentStatusFormDialog;
