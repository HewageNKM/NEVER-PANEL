import {Customer, Order, Tracking} from "@/interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchOrders} from "@/actions/ordersActions";

interface OrdersSlice {
    orders: Order[]
    isLoading: boolean;
    selectedPage: number;
    size: number;
    selectedOrder: Order | null;
    selectedCustomer: Customer | null;
    selectedTracking: Tracking | null;
}

const initialState: OrdersSlice = {
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
        setSelectedOrder: (state, action: PayloadAction<Order>) => {
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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getOrders.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
            state.isLoading = false;
        });
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

export const {
    setOrders,
    setSize,
    setPage,
    setLoading,
    setSelectedOrder,
    setSelectedCustomer,
    setSelectedTracking
} = ordersSlice.actions;
export default ordersSlice.reducer;

