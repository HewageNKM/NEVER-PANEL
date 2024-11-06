import {Item} from "@/interfaces";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface InventorySlice {
    items: Item[];
    loading: boolean;
    selectedItem: Item | null;
    selectedSort: string;
    selectedType: string;
    selectedStock: string;
}

const initialState: InventorySlice = {
    items: [] as Item[],
    loading: false,
    selectedItem: null,
    selectedSort: "none",
    selectedType: "all",
    selectedStock: "all"
}

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<Item[]>) => {
            let items = action.payload;

            // Filter by selectedType if it's not set to "all"
            if (state.selectedType !== "all") {
                items = items.filter(item => item.type === state.selectedType);
            }

            // Filter by selectedStock if it's not set to "all"
            if (state.selectedStock !== "all") {
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
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
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
        setSelectedStock: (state, action: PayloadAction<string>) => {
            state.selectedStock = action.payload;
        },
    },
})

export const {
    setItems,
    setLoading,
    setSelectedItem,
    setSelectedSort,
    setSelectedType,
    setSelectedStock
} = inventorySlice.actions;
export default inventorySlice.reducer;

