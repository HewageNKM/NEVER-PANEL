import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getBannersAction} from "@/actions/settingActions";

interface BannersSlice {
    banners:[];
    isLoading: boolean;
}

const initialState: BannersSlice = {
    banners: [],
    isLoading: false
}

export const bannersSlice = createSlice({
    name: 'banners',
    initialState,
    reducers: {
        setBanners: (state, action) => {
            state.banners = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(getBanners.fulfilled, (state, action) => {
            state.banners = action.payload;
            state.isLoading = false;
        });
        builder.addCase(getBanners.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getBanners.rejected, (state) => {
            state.isLoading = false;
        })
    }
})

export const getBanners = createAsyncThunk('banners/getBanners', async (arg, thunkAPI) => {
    try {
        return await getBannersAction();
    } catch (e) {
        return thunkAPI.rejectWithValue(e.message);
    }
});
export const {setBanners, setIsLoading} = bannersSlice.actions;
export default bannersSlice.reducer;
