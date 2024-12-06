import React, { useEffect, useState } from 'react';
import { Customer } from "@/interfaces";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { CardActionArea, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";

const CustomerFormDialog = ({ customer, showForm, onClose }: { customer: Customer | null, showForm: boolean, onClose: () => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableCustomer, setEditableCustomer] = useState<Customer | null>(customer);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field: keyof Customer, value: string) => {
        if (editableCustomer) {
            setEditableCustomer({ ...editableCustomer, [field]: value });
        }
    };

    const handleUpdate = () => {
        console.log("Updated customer details:", editableCustomer);
        // Implement update functionality here
        setIsEditing(false);
    };

    const handlePrint = () => {
        console.log("Print functionality triggered");
        // Implement print functionality here
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
                <IconButton onClick={handleEditToggle} style={{ float: 'right' }}>
                    <EditIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2}>
                    {isEditing ? (
                        <Stack flexDirection="column" gap={2} mt={3}>
                            <TextField
                                label="Name"
                                value={editableCustomer?.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                value={editableCustomer?.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Phone"
                                value={editableCustomer?.phone || ''}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Address"
                                value={editableCustomer?.address || ''}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="City"
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
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px' }}>
                        <Button size="small" color="primary" onClick={onFormClose}>
                            Close
                        </Button>
                        {isEditing && (
                            <Button variant="contained" color="primary" onClick={handleUpdate}>
                                Save
                            </Button>
                        )}
                        <Button variant="contained" color="secondary" onClick={handlePrint}>
                            Print
                        </Button>
                    </div>
                </CardActions>
            </DialogContent>
        </Dialog>
    );
};

export default CustomerFormDialog;
