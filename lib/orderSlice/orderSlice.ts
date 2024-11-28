import {Order} from "@/interfaces";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {fetchOrders} from "@/actions/ordersActions";

interface OrderSlice {
    orders: Order[];
    selectedOrder: Order | null;
    size: number,
    page: number,
    selectedSort: string;
    selectedType: string;
    showEditingForm: boolean;
}

const initialState: OrderSlice = {
    orders: [] as Order[],
    page: 1,
    size: 50,
    selectedOrder: null,
    selectedSort: "none",
    selectedType: "all",
    showEditingForm: false,
}
const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setSize: (state, action) => {
            state.size = action.payload;
        },
        setSelectedOrder: (state, action) => {
            state.selectedOrder = action.payload;
        },
        setSelectedSort: (state, action) => {
            state.selectedSort = action.payload;
        },
        setSelectedType: (state, action) => {
            state.selectedType = action.payload;
        },
        setShowEditingForm: (state, action) => {
            state.showEditingForm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
        });
    }
});
export const getOrders = createAsyncThunk("order/getOrders", async ({page, size}: {
    page: number,
    size: number
}, thunkAPI) => {
    try {
        return await fetchOrders(page, size);
    } catch (e: any) {
        return thunkAPI.rejectWithValue(e.message);
    }
});
export const {
    setOrders,
    setPage,
    setSize,
    setSelectedOrder,
    setSelectedSort,
    setSelectedType,
    setShowEditingForm
} = orderSlice.actions;
export default orderSlice.reducer;