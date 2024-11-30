import {createSlice} from '@reduxjs/toolkit';
import {User} from "@firebase/auth";

interface Interface {
    currentUser: User | null;
    loading: boolean;
}

const initialState: Interface = {
    currentUser: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.currentUser = action.payload;
        },
        clearUser(state) {
            state.currentUser = null;
        },
    },
});

export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
