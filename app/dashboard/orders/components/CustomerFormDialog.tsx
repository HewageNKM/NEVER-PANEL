import React, {useEffect, useState} from 'react';
import {Customer, Order} from "@/interfaces";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import {updateAOrder} from "@/actions/ordersActions";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {getOrders} from "@/lib/ordersSlice/ordersSlice";

const CustomerFormDialog = ({customer, showForm, onClose}: {
    customer: Customer | null,
    showForm: boolean,
    onClose: () => void
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableCustomer, setEditableCustomer] = useState<Customer | null>(customer);
    const [isLoading, setIsLoading] = useState(false)
    const {selectedOrder} = useAppSelector(state => state.ordersSlice);

    const {selectedPage, size} = useAppSelector(state => state.ordersSlice);
    const dispatch = useAppDispatch();

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field: keyof Customer, value: string) => {
        if (editableCustomer) {
            setEditableCustomer({...editableCustomer, [field]: value});
        }
    };

    const handleUpdate = async (evt) => {
        try {
            setIsLoading(true);
            evt.preventDefault()
            const updatedOrder: Order = {
                ...selectedOrder,
                customer: editableCustomer
            }
            await updateAOrder(updatedOrder);
            onClose();
            dispatch(getOrders({size, page: selectedPage}))
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        console.log("Print functionality triggered");
    };

    useEffect(() => {
        setEditableCustomer(customer);
    }, [customer]);

    const onFormClose = () => {
        setIsEditing(false);
        setEditableCustomer(null);
        onClose();
    };

    return (
        <Dialog open={showForm} onClose={onFormClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant={"h4"}>Customer Details</Typography>
                <IconButton className="disabled:bg-opacity-60 disabled:cursor-not-allowed" disabled={isLoading}
                            onClick={handleEditToggle} style={{float: 'right'}}>
                    <EditIcon/>
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2}>
                    {isEditing ? (
                        <Stack flexDirection="column" gap={2} mt={3}>
                            <TextField
                                disabled={isLoading}
                                label="Name"
                                name={"name"}
                                required
                                value={editableCustomer?.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                disabled={isLoading}
                                label="Email"
                                name={"email"}
                                required
                                type="email"
                                value={editableCustomer?.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                disabled={isLoading}
                                name={"phone"}
                                label="Phone"
                                required
                                type="tel"
                                value={editableCustomer?.phone || ''}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                required
                                disabled={isLoading}
                                label="Address"
                                name={"address"}
                                value={editableCustomer?.address || ''}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                disabled={isLoading}
                                required
                                label="City"
                                name={"city"}
                                value={editableCustomer?.city || ''}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                fullWidth
                            />
                        </Stack>
                    ) : (
                        <Stack flexDirection="column" gap={1}>
                            <Typography variant="h4">{editableCustomer?.name}</Typography>
                            <Typography variant="h6">Email: {editableCustomer?.email}</Typography>
                            <Typography variant="h6">Phone: {editableCustomer?.phone}</Typography>
                            <Typography variant="h6">Address: {editableCustomer?.address}</Typography>
                            <Typography variant="h6">City: {editableCustomer?.city}</Typography>
                        </Stack>
                    )}
                </Box>

                <CardActions sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '16px',
                    marginTop: '24px'
                }}>
                    <div style={{display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px'}}>
                        <Button size="small" className="disabled:bg-opacity-60 disabled:cursor-not-allowed"
                                disabled={isLoading} color="primary" onClick={onFormClose}>
                            Close
                        </Button>
                        {isEditing && (
                            <Button className="disabled:bg-opacity-60 disabled:cursor-not-allowed" disabled={isLoading}
                                    variant="contained" color="primary" onClick={handleUpdate}>
                                Save
                            </Button>
                        )}
                        <Button className="disabled:bg-opacity-60 disabled:cursor-not-allowed" disabled={isLoading}
                                variant="contained" color="secondary" onClick={handlePrint}>
                            Print
                        </Button>
                    </div>
                </CardActions>
            </DialogContent>
        </Dialog>
    );
};

export default CustomerFormDialog;
