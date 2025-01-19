import {Customer, Order, PaymentMethod, Tracking} from "@/interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchOrders} from "@/actions/ordersActions";
import {getAllPaymentMethod} from "@/actions/paymentMethodAction";

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
}

const initialState: OrdersSlice = {
    selectedPayment: null,
    isPaymentLoading: false,
    payments:[],
    orders: [],
    isLoading: false,
    selectedPage: 1,
    size: 20,
    selectedOrder: null,
    selectedCustomer: null,
    selectedTracking: null
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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getOrders.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
            state.isLoading = false;
        }).addCase(getPayments.pending, (state) => {
            state.isLoading = true;
        }).addCase(getPayments.fulfilled, (state,action) => {
            state.isLoading = false;
            state.payments = action.payload;
        })
    }
});

export const getOrders = createAsyncThunk("orders/getOrders", async ({size, page}: {
    size: number;
    page: number;
}, thunkAPI) => {
    try {
        return await fetchOrders(page, size);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const getPayments = createAsyncThunk("orders/getPayments", async (arg,thunkAPI) => {
    try {
        return await getAllPaymentMethod();
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
    setSelectedCustomer,
    setSelectedTracking,
    setSelectedPayment
} = ordersSlice.actions;
export default ordersSlice.reducer;

