import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Tooltip,
    IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {getOrders} from "@/lib/orderSlice/orderSlice";
import {Customer, Order, OrderItem} from "@/interfaces";

interface CustomerDialogProps {
    customer: Customer;
    open: boolean;
    onClose: () => void;
}

interface OrderItemsDialogProps {
    items: OrderItem[];
    open: boolean;
    onClose: () => void;
}

// Customer dialog component
const CustomerDialog: React.FC<CustomerDialogProps> = ({customer, open, onClose}) => (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Customer Details</DialogTitle>
        <DialogContent>
            <Typography variant="body1" gutterBottom><strong>ID:</strong> {customer.id}</Typography>
            <Typography variant="body1" gutterBottom><strong>Name:</strong> {customer.name}</Typography>
            <Typography variant="body1" gutterBottom><strong>Email:</strong> {customer.email}</Typography>
            <Typography variant="body1" gutterBottom><strong>Phone:</strong> {customer.phone}</Typography>
            <Typography variant="body1" gutterBottom><strong>Address:</strong> {customer.address}</Typography>
            <Typography variant="body1" gutterBottom><strong>City:</strong> {customer.city}</Typography>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" onClick={onClose} color="primary">Close</Button>
        </DialogActions>
    </Dialog>
);

// Order items dialog component
const OrderItemsDialog: React.FC<OrderItemsDialogProps> = ({items, open, onClose}) => (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Order Items</DialogTitle>
        <DialogContent>
            {items.map((item, index) => (
                <div key={index} style={{marginBottom: '10px'}}>
                    <Typography variant="body1"><strong>Item ID:</strong> {item.itemId}</Typography>
                    <Typography variant="body1"><strong>Name:</strong> {item.name}</Typography>
                    <Typography variant="body1"><strong>Variant:</strong> {item.variantName}</Typography>
                    <Typography variant="body1"><strong>Size:</strong> {item.size}</Typography>
                    <Typography variant="body1"><strong>Quantity:</strong> {item.quantity}</Typography>
                    <Typography variant="body1"><strong>Price:</strong> LKR {item.price.toFixed(2)}</Typography>
                    <hr style={{border: '0.5px solid #ddd'}}/>
                </div>
            ))}
        </DialogContent>
        <DialogActions>
            <Button variant="contained" onClick={onClose} color="primary">Close</Button>
        </DialogActions>
    </Dialog>
);

const Orders = () => {
    const {currentUser} = useAppSelector(state => state.authSlice);
    const {page, size, orders} = useAppSelector(state => state.orderSlice);
    const dispatch = useAppDispatch();

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedItems, setSelectedItems] = useState<OrderItem[] | null>(null);

    const handleCustomerDialogClose = () => setSelectedCustomer(null);
    const handleOrderItemsDialogClose = () => setSelectedItems(null);

    useEffect(() => {
        if (currentUser) {
            dispatch(getOrders({page, size}));
        }
    }, [currentUser, page, size, dispatch]);

    return (
        <TableContainer component={Paper} elevation={3} style={{marginTop: '20px'}}>
            <Table>
                <TableHead>
                    <TableRow style={{backgroundColor: '#f5f5f5'}}>
                        <TableCell><strong>Order ID</strong></TableCell>
                        <TableCell><strong>Payment ID</strong></TableCell>
                        <TableCell><strong>Payment Status</strong></TableCell>
                        <TableCell><strong>Payment Method</strong></TableCell>
                        <TableCell><strong>Shipping Cost</strong></TableCell>
                        <TableCell><strong>Created At</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.orderId} hover>
                            <TableCell>#{order.orderId}</TableCell>
                            <TableCell>{order.paymentId}</TableCell>
                            <TableCell>
                                <Tooltip title={order.paymentStatus} arrow>
                                    <span>{order.paymentStatus}</span>
                                </Tooltip>
                                <IconButton
                                    color="primary"
                                    onClick={() => setSelectedCustomer(order.customer)}
                                    style={{marginRight: '10px'}}
                                >
                                    <InfoIcon/>
                                </IconButton>
                            </TableCell>
                            <TableCell>{order.paymentMethod}</TableCell>
                            <TableCell>LKR {order.shippingCost.toFixed(2)}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                            <TableCell>
                                <IconButton
                                    color="primary"
                                    onClick={() => setSelectedCustomer(order.customer)}
                                    style={{marginRight: '10px'}}
                                >
                                    <InfoIcon/>
                                </IconButton>
                                <Button
                                    variant="outlined"
                                    onClick={() => setSelectedItems(order.items)}
                                    color="secondary"
                                >
                                    View Items
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Dialogs */}
            {selectedCustomer && (
                <CustomerDialog
                    customer={selectedCustomer}
                    open={Boolean(selectedCustomer)}
                    onClose={handleCustomerDialogClose}
                />
            )}
            {selectedItems && (
                <OrderItemsDialog
                    items={selectedItems}
                    open={Boolean(selectedItems)}
                    onClose={handleOrderItemsDialogClose}
                />
            )}
        </TableContainer>
    );
};

export default Orders;
