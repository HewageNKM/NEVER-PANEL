import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import {
    Box,
    Checkbox,
    DialogActions,
    FormControlLabel,
    Switch,
    TextareaAutosize,
    TextField,
    Typography
} from "@mui/material";
import {PaymentMethod} from "@/interfaces";
import {createPaymentMethod, updatePaymentMethod} from "@/actions/paymentMethodAction";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import { getPayments } from "@/lib/ordersSlice/ordersSlice";

const PaymentMethodForm = ({

                               showPaymentMethodForm,
                               onClose,
                           }: {
    showPaymentMethodForm: boolean;
    onClose: () => void;
}) => {
    const dispatch:AppDispatch = useDispatch();
    const [available, setAvailable] = useState<string[]>([]);
    const {selectedPayment} = useSelector((state:RootState) => state.ordersSlice);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Initialize available selections based on the passed paymentMethod
        if (selectedPayment?.available) {
            setAvailable(selectedPayment.available);
        }
    }, [selectedPayment]);

    const toggleAvailableSelection = (value: string) => {
        setAvailable((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            setIsLoading(true);
            e.preventDefault();
            if (selectedPayment) {
                console.log("Updating payment method");
                const id = e.target.id.value.toString().toLowerCase();
                const name = e.target.name.value.toString().toUpperCase();
                const fee = Number.parseFloat(e.target.fee.value);
                const status = e.target.status.checked ? "Active" : "Inactive";
                const description = e.target.description.value.toString();

                const updatedPaymentMethod: PaymentMethod = {
                    paymentId: id,
                    name,
                    fee,
                    available,
                    status,
                    description,
                    createdAt: selectedPayment.createdAt,
                    updatedAt: new Date().toISOString(),
                };
                await updatePaymentMethod(updatedPaymentMethod);
                onClose();
            }else {
                console.log("Creating new payment method");
                const id = e.target.id.value.toString().toLowerCase();
                const name = e.target.name.value.toString().toUpperCase();
                const fee = Number.parseFloat(e.target.fee.value);
                const status = e.target.status.checked ? "Active" : "Inactive";

                const newPaymentMethod: PaymentMethod = {
                    paymentId: id,
                    name,
                    fee,
                    available,
                    status,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                await createPaymentMethod(newPaymentMethod);
                onClose();
            }
            dispatch(getPayments());
        }catch (e) {
            console.error(e)
        }finally {
            setIsLoading(false)
        }
    };

    const generateId = () => {
        return "pm-" + Math.floor(100 + Math.random() * 900);
    }
    return (
        <Dialog open={showPaymentMethodForm} onClose={onClose} fullWidth>
            <DialogTitle>Payment Method Details</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box mb={2}>
                        <TextField
                            name="id"
                            label="Payment ID"
                            value={selectedPayment?.paymentId.toUpperCase() || generateId().toUpperCase()}
                            fullWidth
                            margin="normal"
                            disabled
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            name="name"
                            label="Method Name"
                            placeholder="CASH, CARD, etc."
                            variant="outlined"
                            size="small"
                            defaultValue={selectedPayment?.name}
                            fullWidth
                            disabled={isLoading}
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextareaAutosize
                            minRows={5}
                            style={{
                                padding: "5px",
                                width: "100%",
                            }}
                            name="description"
                            placeholder="description"
                            variant="outlined"
                            size="small"
                            defaultValue={selectedPayment?.description}
                            fullWidth
                            disabled={isLoading}
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            name="fee"
                            label="Fee"
                            type="number"
                            disabled={isLoading}
                            defaultValue={selectedPayment?.fee}
                            fullWidth
                            required
                            margin="normal"
                            inputProps={{
                                min: 0,
                                step: 0.01,
                                "aria-label": "Fee percentage",
                            }}
                            InputProps={{
                                endAdornment: <Typography>%</Typography>,
                            }}
                        />
                    </Box>
                    <Typography variant="subtitle1" gutterBottom>
                        Availability
                    </Typography>
                    <Box display="flex" gap={2} mb={2}>
                        {["Store", "Website"].map((option) => (
                            <FormControlLabel
                                key={option}
                                control={
                                    <Checkbox
                                        disabled={isLoading}
                                        checked={available.includes(option)}
                                        onChange={() => toggleAvailableSelection(option)}
                                        inputProps={{"aria-label": `Available in ${option}`}}
                                    />
                                }
                                label={option}
                            />
                        ))}
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                        <FormControlLabel
                            disabled={isLoading}
                            name="status"
                            control={
                                <Switch
                                    defaultChecked={selectedPayment?.status === "Active"}
                                    inputProps={{"aria-label": "Status toggle"}}
                                />
                            }
                            label="Active Status"
                            labelPlacement="start"
                            sx={{
                                marginRight: 2,
                                ".MuiFormControlLabel-label": {
                                    fontWeight: 500,
                                    fontSize: "1rem",
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button variant="contained" color="success" type="submit">
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PaymentMethodForm;
