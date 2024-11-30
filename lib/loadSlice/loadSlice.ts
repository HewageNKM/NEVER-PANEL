import {createSlice} from "@reduxjs/toolkit";
import {Error} from "@/interfaces";

interface LoadSlice {
    isLoaded: boolean;
    errors: Error[];
}

const initialState: LoadSlice = {
    errors: [],
    isLoaded: false
}

const loadSlice = createSlice({
    name: "load",
    initialState,
    reducers: {
        setLoading: (state,action) => {
            state.isLoaded = action.payload;
        },
        setError: (state, action) => {
            state.errors.push(action.payload);
        },
        hideError: (state,action) => {
            state.errors = state.errors.filter(error => error.id !== action.payload);
        }
    }
});

export const {setLoading,setError, hideError} = loadSlice.actions;
export default loadSlice.reducer;