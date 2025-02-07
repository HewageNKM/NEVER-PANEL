import {Customer, Order, PaymentMethod, Tracking} from "@/interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchOrdersAction} from "@/actions/ordersActions";
import {getAllPaymentMethodAction} from "@/actions/paymentMethodActions";

interface OrdersSlice {
    orders: Order[]
    isLoading: boolean;
    isPaymentLoading: boolean;
    payments: PaymentMethod[];
    selectedPayment: PaymentMethod | null;
    selectedPage: number;
    size: number;
    selectedOrder: Order | null;
    selectedCustomer: Customer | null;
    selectedTracking: Tracking | null;
    selectedFilterStatus: string;
    selectedFilterTracking: string;
}

const initialState: OrdersSlice = {
    selectedPayment: null,
    isPaymentLoading: false,
    payments: [],
    orders: [],
    isLoading: false,
    selectedPage: 1,
    size: 20,
    selectedOrder: null,
    selectedCustomer: null,
    selectedTracking: null,
    selectedFilterStatus: "all",
    selectedFilterTracking: "all"
}

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<Order[]>) => {
            state.orders = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
            state.selectedOrder = action.payload;
        },
        setSelectedCustomer: (state, action: PayloadAction<Customer>) => {
            state.selectedCustomer = action.payload;
        },
        setSelectedTracking: (state, action: PayloadAction<Tracking>) => {
            state.selectedTracking = action.payload;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.selectedPage = action.payload;
        },
        setSize: (state, action: PayloadAction<number>) => {
            state.size = action.payload
        },
        setSelectedPayment: (state, action: PayloadAction<PaymentMethod | null>) => {
            state.selectedPayment = action.payload;
        },
        setSelectedFilterStatus: (state, action: PayloadAction<string>) => {
            state.selectedFilterStatus = action.payload;
        },
        setSelectedFilterTracking: (state, action: PayloadAction<string>) => {
            state.selectedFilterTracking = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getOrders.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
            const ordersAction = action.payload;
            let orders: Order[] = []

            switch (state.selectedFilterStatus.toLowerCase()) {
                case "paid":
                    orders.push(...ordersAction.filter((order: Order) => order.paymentStatus.toLowerCase() === "paid"))
                    break;
                case "pending":
                    orders.push(...ordersAction.filter((order: Order) => order.paymentStatus.toLowerCase() === "pending"))
                    break;
                case "failed":
                    orders.push(...ordersAction.filter((order: Order) => order.paymentStatus.toLowerCase() === "failed"))
                    break;
                case "refunded":
                    orders.push(...ordersAction.filter((order: Order) => order.paymentStatus.toLowerCase() === "refunded"))
                    break;
                default:
                    orders = ordersAction;
                    break;
            }

            switch (state.selectedFilterTracking.toLowerCase()) {
                case "processing":
                    orders = orders.filter((order: Order) => (order.from.toLowerCase() === "website" && order.tracking === null))
                    break;
                case "shipped":
                    orders = orders.filter((order: Order) => order.tracking?.status.toLowerCase() === "shipped")
                    break;
                case "cancelled":
                    orders = orders.filter((order: Order) => order.tracking?.status.toLowerCase() === "cancelled")
                    break;
                case "complete":
                    orders = orders.filter((order: Order) => (order.from.toLowerCase() === "store" || order.tracking?.status.toLowerCase() === "complete"))
                    break;
                default:
                    break;
            }
            state.orders = orders;
            state.isLoading = false;
        }).addCase(getPayments.pending, (state) => {
            state.isPaymentLoading = true;
        }).addCase(getPayments.fulfilled, (state, action) => {
            state.isPaymentLoading = false;
            state.payments = action.payload;
        })
    }
});

export const getOrders = createAsyncThunk("orders/getOrders", async ({size, page}: {
    size: number;
    page: number;
}, thunkAPI) => {
    try {
        return await fetchOrdersAction(page, size);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const getPayments = createAsyncThunk("orders/getPayments", async (arg, thunkAPI) => {
    try {
        return await getAllPaymentMethodAction();
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const {
    setOrders,
    setSize,
    setPage,
    setLoading,
    setSelectedOrder,
    setSelectedFilterStatus,
    setSelectedFilterTracking,
    setSelectedPayment
} = ordersSlice.actions;
export default ordersSlice.reducer;

