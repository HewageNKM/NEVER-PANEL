import {createSlice} from "@reduxjs/toolkit";

interface ToastSlice {
    showToast: boolean,
    message: string,
    type: string
}

const initialState: ToastSlice = {
    showToast: false,
    message: "",
    type: ""
}

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        showToast: (state, action) => {
            state.showToast = action.payload.showToast;
            state.message = action.payload.message;
            state.type = action.payload.type;
        },
        hideToast: (state) => {
            state.showToast = false;
            state.message = "";
            state.type = "";
        }
    }
})

export const {showToast, hideToast} = toastSlice.actions;
export default toastSlice.reducer;
