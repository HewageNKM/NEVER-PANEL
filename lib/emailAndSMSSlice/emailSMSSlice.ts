import {Email, SMS} from "@/interfaces";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getAllEmailsAction, getAllSMSAction} from "@/actions/emailAndSMSActions";

interface EmailSMSSlice {
    emails: Email[];
    isEmailsLoading: boolean;
    emailPage: number;
    emailSize: number;
    isSMSLoading: boolean;
    smsPage: number;
    smsSize: number;
    sms: SMS[];
}

const initialState: EmailSMSSlice = {
    emails: [],
    isEmailsLoading: false,
    emailPage: 1,
    emailSize: 20,
    isSMSLoading: false,
    smsPage: 1,
    smsSize: 20,
    sms: []
}

const emailSMSSlice = createSlice({
    name: 'emailSMSSlice',
    initialState,
    reducers: {
        setEmailsPage: (state, action) => {
            state.emailPage = action.payload;
        },
        setEmailsSize: (state, action) => {
            state.emailSize = action.payload;
        },
        setSMSPage: (state, action) => {
            state.smsPage = action.payload;
        },
        setSMSSize: (state, action) => {
            state.smsSize = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(getEmails.pending, (state, action) => {
            state.isEmailsLoading = true;
        });
        builder.addCase(getEmails.fulfilled, (state, action) => {
            state.emails = action.payload;
            state.isEmailsLoading = false;
        });
        builder.addCase(getEmails.rejected, (state, action) => {
            state.isEmailsLoading = false;
        }).addCase(getSMS.pending, (state, action) => {
            state.isSMSLoading = true;
        }).addCase(getSMS.fulfilled, (state, action) => {
            state.sms = action.payload;
            state.isSMSLoading = false;
        }).addCase(getSMS.rejected, (state, action) => {
            state.isSMSLoading = false;
        })
    }
})
export const getEmails = createAsyncThunk('emailSMSSlice/getEmails', async (arg: {
        page: number,
        size: number
    }, thunkAPI) => {
        try {
            return await getAllEmailsAction(arg.page, arg.size);
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response ? e.response.data.message : e.message);
        }
    }
)
export const getSMS = createAsyncThunk('emailSMSSlice/getSMS', async (arg: {
    page: number,
    size: number
}, thunkAPI) => {
    try {
        return await getAllSMSAction(arg.page, arg.size);
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response ? e.response.data.message : e.message);
    }
})
export const {setEmailsPage, setEmailsSize,setSMSPage,setSMSSize} = emailSMSSlice.actions;
export default emailSMSSlice.reducer;
