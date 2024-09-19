import {createSlice} from "@reduxjs/toolkit";

interface PageLoaderSlice{
    isLoading: boolean;
}
const initialState: PageLoaderSlice = {
    isLoading: false,
}

const pageLoaderSlice = createSlice({
    name: 'pageLoader',
    initialState,
    reducers: {
        showLoader: (state) => {
            state.isLoading = true;
        },
        hideLoader: (state) => {
            state.isLoading = false;
        }
    }
});

export const {showLoader, hideLoader} = pageLoaderSlice.actions;
export default pageLoaderSlice.reducer;
