import {Expense} from "@/model";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getAllExpensesAction, getAllExpensesByDateAction} from "@/actions/expenseActions";

interface ExpensesSlice {
    selectedFilterType: string;
    selectedFilterFor: string;
    expenses: Expense[];
    page: number;
    size: number;
    isLoading: boolean;
}

const initialState: ExpensesSlice = {
    selectedFilterType: "all",
    selectedFilterFor: "all",
    expenses: [],
    isLoading: false,
    page: 1,
    size: 50
}


export const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        setSelectedFilterType: (state, action) => {
            state.selectedFilterType = action.payload;
        },
        setSelectedFilterFor: (state, action) => {
            state.selectedFilterFor = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setSize: (state, action) => {
            state.size = action.payload
        },setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(getAllExpenses.fulfilled, (state, action) => {
            applyFilter(state, action);
        });
        builder.addCase(getAllExpenses.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getAllExpenses.rejected, (state) => {
            state.isLoading = false;
        }).addCase(getAllExpensesByDate.fulfilled, (state, action) => {
            applyFilter(state, action);
        }).addCase(getAllExpensesByDate.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAllExpensesByDate.rejected, (state) => {
            state.isLoading = false;
        })
    }
})

const applyFilter = (state, action) => {
    let expenses = action.payload;
    switch (state.selectedFilterType) {
        case "utility":
            expenses = expenses.filter((expense: Expense) => expense.type === state.selectedFilterType);
            break;
        case "expense":
            expenses = expenses.filter((expense: Expense) => expense.type === state.selectedFilterType);
            break;
        default:
            expenses = action.payload;
    }

    switch (state.selectedFilterFor) {
        case "ceb":
            expenses = expenses.filter((expense: Expense) => expense.for === "ceb");
            break;
        case "water":
            expenses = expenses.filter((expense: Expense) => expense.for === "water");
            break;
        case "communication":
            expenses = expenses.filter((expense: Expense) => expense.for === "communication");
            break;
        case "rent":
            expenses = expenses.filter((expense: Expense) => expense.for === "rent");
            break;
        case "salary":
            expenses = expenses.filter((expense: Expense) => expense.for === "salary");
            break;
        case "transport":
            expenses = expenses.filter((expense: Expense) => expense.for === "transport");
            break;
        case "food":
            expenses = expenses.filter((expense: Expense) => expense.for === "food");
            break;
        case "other":
            expenses = expenses.filter((expense: Expense) => expense.for === "other");
            break;
        default:
            state.expenses = expenses;
    }
    state.expenses = expenses;
    state.isLoading = false;
}
export const getAllExpenses = createAsyncThunk('expenses/getAllExpenses', async ({page, size}: {
        page: number,
        size: number
    }, thunkAPI) => {
        try {
            return await getAllExpensesAction(page, size);
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response ? e.response.data.message : e.message)
        }
    }
)
export const getAllExpensesByDate = createAsyncThunk('expenses/getAllExpensesByDate', async (date: string, thunkAPI) => {
    try {
        return await getAllExpensesByDateAction(date);
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response ? e.response.data.message : e.message)
    }
})

export const {setSelectedFilterType, setSelectedFilterFor, setSize, setPage, setIsLoading} = expensesSlice.actions;
export default expensesSlice.reducer;