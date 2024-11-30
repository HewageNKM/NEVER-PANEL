import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {getOrders} from "@/lib/orderSlice/orderSlice";
import {Customer, OrderItem, Tracking} from "@/interfaces";

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

const AddressDialog: React.FC<CustomerDialogProps> = ({customer, open, onClose}) => (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Customer Details</DialogTitle>
        <DialogContent>
            <Typography variant="body1" gutterBottom><strong>Name:</strong> {customer?.name}</Typography>
            <Typography variant="body1" gutterBottom><strong>Email:</strong> {customer?.email}</Typography>
            <Typography variant="body1" gutterBottom><strong>Phone:</strong> {customer?.phone}</Typography>
            <Typography variant="body1" gutterBottom><strong>Address:</strong> {customer?.address}</Typography>
            <Typography variant="body1" gutterBottom><strong>City:</strong> {customer?.city}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary" variant="contained">Close</Button>
        </DialogActions>
    </Dialog>
);

const OrderItemsDialog: React.FC<OrderItemsDialogProps> = ({items, open, onClose}) => (
    <Dialog open={open} onClose={onClose} sx={{padding:"3rem"}}>
        <DialogTitle>Order Items</DialogTitle>
        <DialogContent sx={{padding: '20px', backgroundColor: '#f9f9f9'}}>
            {items?.map((item, index) => (
                <div key={index} style={{marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px'}}>
                    <Typography variant="body1" gutterBottom><strong>Item ID:</strong> {item.itemId}</Typography>
                    <Typography variant="body1" gutterBottom><strong>Name:</strong> {item.name}</Typography>
                    <Typography variant="body1" gutterBottom><strong>Variant:</strong> {item.variantName}</Typography>
                    <Typography variant="body1" gutterBottom><strong>Size:</strong> {item.size}</Typography>
                    <Typography variant="body1" gutterBottom><strong>Quantity:</strong> {item.quantity}</Typography>
                    <Typography variant="body1" gutterBottom><strong>Price:</strong> LKR {item.price.toFixed(2)}
                    </Typography>
                </div>
            ))}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary" variant="contained">Close</Button>
        </DialogActions>
    </Dialog>
);

const Orders = () => {
    const {currentUser} = useAppSelector(state => state.authSlice);
    const {page, size, orders} = useAppSelector(state => state.orderSlice);
    const [tracking, setTracking] = useState<Tracking | null>(null)
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
        <TableContainer
            component={Paper}
            elevation={3}
            sx={{
                marginTop: 2,
                overflowX: 'auto', // Enable horizontal scrolling
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {["Order ID", "Payment ID", "Payment Status", "Payment Method", "Total", "Shipping Cost", "Address", "Created At", "Location", "Status","Actions"].map((header) => (
                            <TableCell key={header} sx={{fontWeight: 'bold', backgroundColor: '#f5f5f5'}}>
                                {header}
                            </TableCell>
                        ))}
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
                                    sx={{marginRight: 1}}
                                >
                                    <InfoIcon/>
                                </IconButton>
                            </TableCell>
                            <TableCell>{order.paymentMethod}</TableCell>
                            <TableCell>
                                LKR {order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                            </TableCell>
                            <TableCell>LKR {order.shippingCost.toFixed(2)}</TableCell>
                            <TableCell>
                                {order.customer ? order.customer.name : "Not Available"} {order.customer && (
                                <IconButton
                                    color="primary"
                                    onClick={() => setSelectedCustomer(order.customer)}
                                    sx={{marginRight: 1}}
                                >
                                    <InfoIcon/>
                                </IconButton>
                            )}
                            </TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                            <TableCell>{order.from}</TableCell>
                            <TableCell>

                            </TableCell>
                            <TableCell>
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

            <AddressDialog
                customer={selectedCustomer}
                open={selectedCustomer !== null}
                onClose={handleCustomerDialogClose}
            />
            <OrderItemsDialog
                items={selectedItems}
                open={selectedItems !== null}
                onClose={handleOrderItemsDialogClose}
            />
        </TableContainer>
    );
};

export default Orders;
