import {Email} from "@/interfaces";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getAllEmails} from "@/actions/emailAndSMSActon";

interface EmailSMSSlice {
    emails: Email[];
    isLoading: boolean;
    page: number;
    size: number;
}

const initialState: EmailSMSSlice = {
    emails: [],
    isLoading: false,
    page: 0,
    size: 20
}

const emailSMSSlice = createSlice({
    name: 'emailSMSSlice',
    initialState,
    reducers: {
        setEmails: (state, action) => {
            state.emails = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setSize: (state, action) => {
            state.size = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(getEmails.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(getEmails.fulfilled, (state, action) => {
            state.emails = action.payload;
            state.isLoading = false;
        });
        builder.addCase(getEmails.rejected, (state, action) => {
            state.isLoading = false;
        });
    }
})
export const getEmails = createAsyncThunk('emailSMSSlice/getEmails', async (arg: { page: number, size: number},thunkAPI) => {
        try {
            return await getAllEmails(arg.page, arg.size);
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response ? e.response.data.message : e.message);
        }
    }
)
export const {setEmails, setLoading, setPage, setSize} = emailSMSSlice.actions;
export default emailSMSSlice.reducer;
