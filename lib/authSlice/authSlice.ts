import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        loading: true,
    },
    reducers: {
        setUser(state, action) {
            state.currentUser = action.payload;
            state.loading = false; // Set loading to false when user data is available
        },
        clearUser(state) {
            state.currentUser = null;
            state.loading = false; // Clear user and set loading to false
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
