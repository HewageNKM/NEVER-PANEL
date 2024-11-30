import {Item, Variant} from "@/interfaces";
import {createSlice} from "@reduxjs/toolkit";

interface ItemDetailsSlice {
    showEditingForm: boolean;
    selectedVariant: Variant | null;
    item: Item | null;
}

const initialState: ItemDetailsSlice = {
    showEditingForm: false,
    selectedVariant: null,
    item: null
}

const itemDetailsSlice = createSlice({
    name: "itemDetails",
    initialState,
    reducers: {
        setShowEditingForm: (state, action) => {
            state.showEditingForm = action.payload;
        },
        setSelectedVariant: (state, action) => {
            state.selectedVariant = action.payload;
        },
        setItem: (state, action) => {
            state.item = action.payload;
        }
    }
});

export const {setShowEditingForm, setSelectedVariant, setItem} = itemDetailsSlice.actions;
export default itemDetailsSlice.reducer;
