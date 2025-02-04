import {User} from "@/interfaces";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getUsers} from "@/actions/usersAction";

interface UsersSlice {
    users: User[];
    loading: boolean;
    error: string | null;
    selectedUser: User | null;
    selectedStatus: string;
    selectedPage: number;
    selectedSize: number;
    selectedRole: string;
}

const initialState: UsersSlice = {
    users: [],
    loading: false,
    error: null,
    selectedUser: null,
    selectedStatus: "all",
    selectedPage: 1,
    selectedSize: 20,
    selectedRole: "all"
}

const usersSlice = createSlice({
    name: "usersSlice",
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setSelectedStatus: (state, action) => {
            state.selectedStatus = action.payload;
        },
        setSelectedPage: (state, action) => {
            state.selectedPage = action.payload;
        },
        setSelectedSize: (state, action) => {
            state.selectedSize = action.payload;
        },
        setSelectedRole: (state, action) => {
            state.selectedRole = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(getAllUsers.fulfilled, (state, action) => {
            let users = action.payload;
            if (state.selectedRole !== "all") {
                users = users.filter((user:User) => user.role.toLowerCase() === state.selectedRole.toLowerCase());
            }

            if (state.selectedStatus !== "all") {
                users = users.filter((user:User) => user.status.toLowerCase() === state.selectedStatus.toLowerCase());
            }
            state.users = users;
            state.loading = false;
        }).addCase(getAllUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    }
});

export const getAllUsers = createAsyncThunk("usersSlice/getAllUsers", async ({size, page}: {
    size: number;
    page: number;
}, thunkAPI) => {
    try {
        return getUsers(page, size);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const {
    setSelectedUser,
    setSelectedStatus,
    setSelectedPage,
    setSelectedSize,
    setSelectedRole
} = usersSlice.actions;
export default usersSlice.reducer;