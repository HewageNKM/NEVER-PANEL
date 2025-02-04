import { User } from "@/interfaces";
import {createSlice} from "@reduxjs/toolkit";

interface UsersSlice {
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UsersSlice = {
    users: [],
    loading: false,
    error: null
}

const usersSlice = createSlice({
    name: "usersSlice",
    initialState,
    reducers: {
        getUsers(state) {
            state.loading = true;
        },
        getUsersSuccess(state, action) {
            state.users = action.payload;
            state.loading = false;
            state.error = null;
        },
        getUsersFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        }
    }
})

export const { getUsers, getUsersSuccess, getUsersFailed } = usersSlice.actions;
export default usersSlice.reducer;