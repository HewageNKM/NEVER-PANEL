import {createSlice} from "@reduxjs/toolkit";
import {Profile} from "@/interfaces";

interface UserSlice {
    user: Profile | null
}

const initialState: UserSlice = {user: null}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            window.localStorage.setItem("neverPosUser", JSON.stringify(action.payload));
        },
        clearUser: (state) => {
            state.user = null;
            window.localStorage.removeItem("neverPosUser");
        }
    }
})

export const {setUser, clearUser} = authSlice.actions;
export default authSlice.reducer;
