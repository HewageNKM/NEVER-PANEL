import {Expense} from "@/interfaces";
import {createSlice} from "@reduxjs/toolkit";

interface ExpensesSlice {
    selectedFilterType: string;
    selectedFilterFor: string;
    expenses: Expense[];
    page: number;
    size: number;
}

const initialState: ExpensesSlice = {
    selectedFilterType: "all",
    selectedFilterFor: "all",
    expenses: [],
    page: 1,
    size: 50
}


export const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        setExpenses: (state, action) => {
            let expenses = action.payload;
            console.log(expenses)
            console.log(state.selectedFilterType, state.selectedFilterFor)
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
        },
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
        }
    }
})

export const {setExpenses, setSelectedFilterType, setSelectedFilterFor, setSize, setPage} = expensesSlice.actions;
export default expensesSlice.reducer;