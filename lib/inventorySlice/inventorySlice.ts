import {Item} from "@/model";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchInventoryAction} from "@/actions/inventoryActions";

interface InventorySlice {
    items: Item[];
    loading: boolean;
    selectedItem: Item | null;
    size: number,
    page: number,
    selectedSort: string;
    selectedType: string;
    showEditingForm: boolean;
}

const initialState: InventorySlice = {
    items: [] as Item[],
    page: 1,
    size: 20,
    loading: false,
    selectedItem: null,
    selectedSort: "none",
    selectedType: "all",
    showEditingForm: false,
}

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setSize: (state, action: PayloadAction<number>) => {
            state.size = action.payload;
        },
        setItems: (state, action: PayloadAction<Item[]>) => {
            state.items = action.payload;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setSelectedItem: (state, action: PayloadAction<Item>) => {
            state.selectedItem = action.payload;
        },
        setSelectedSort: (state, action: PayloadAction<string>) => {
            state.selectedSort = action.payload;
        },
        setSelectedType: (state, action: PayloadAction<string>) => {
            state.selectedType = action.payload;
        },
        setShowEditingForm: (state, action: PayloadAction<boolean>) => {
            state.showEditingForm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getInventoryItems.fulfilled, (state, action) => {
            state.items = action.payload;
            let items = action.payload;

            // Filter by selectedType if it's not set to "all"
            if (state.selectedType !== "all") {
                items = items.filter(item => item.type === state.selectedType);
            }

            // Sort items if a sort option is selected
            if (state.selectedSort !== "none") {
                items = items.slice(); // Make a shallow copy before sorting
                items.sort((a, b) => {
                    if (state.selectedSort === "lh") {
                        return a.sellingPrice - b.sellingPrice;
                    } else if (state.selectedSort === "hl") {
                        return b.sellingPrice - a.sellingPrice;
                    } else if (state.selectedSort === "za") {
                        return a.name.localeCompare(b.name);
                    } else if (state.selectedSort === "az") {
                        return b.name.localeCompare(a.name);
                    }
                    return 0;
                });
            }

            // Update state with the filtered and sorted items
            state.items = items;
            state.loading = false;
        });
        builder.addCase(getInventoryItems.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getInventoryItems.rejected, (state) => {
            state.loading = false;
        });
    }
})
export const getInventoryItems = createAsyncThunk("inventory/fetchInventory", async ({size, page}: {
    size: number;
    page: number;
}, thunkAPI) => {
    try {
        return await fetchInventoryAction(size, page);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const {
    setSelectedItem,
    setShowEditingForm,
    setSelectedSort,
    setSelectedType,
    setSize,
    setPage,
    setItems,
} = inventorySlice.actions;
export default inventorySlice.reducer;

