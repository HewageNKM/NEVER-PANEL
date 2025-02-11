import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {
    getAllExpenses,
    getAllExpensesByDate,
    setIsLoading,
    setPage,
    setSelectedFilterFor,
    setSelectedFilterType,
    setSize
} from '@/lib/expensesSlice/expensesSlice';
import {deleteExpenseByIdAction} from "@/actions/expenseActions";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import EmptyState from "@/app/components/EmptyState";
import {useSnackbar} from "@/contexts/SnackBarContext";
import {useConfirmationDialog} from "@/contexts/ConfirmationDialogContext";
import {IoRefreshOutline} from "react-icons/io5";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import ExpenseForm from './ExpenseForm';

const ExpensesTable = () => {
    const dispatch = useAppDispatch();
    const {
        page,
        size,
        expenses,
        selectedFilterType,
        selectedFilterFor,
        isLoading
    } = useAppSelector(state => state.expensesSlice);
    const {currentUser} = useAppSelector(state => state.authSlice);
    const [showExpenseForm, setShowExpenseForm] = useState(false)
    const {showNotification} = useSnackbar();
    const {showConfirmation} = useConfirmationDialog();


    useEffect(() => {
        if (currentUser) {
            fetchExpenses();
        }
    }, [currentUser, page, size, selectedFilterFor, selectedFilterType]);

    const fetchExpenses = async () => {
        try {
            dispatch(setIsLoading(true));
            dispatch(getAllExpenses({page, size}));
        } catch (e) {
            showNotification(e.message, "error");
            console.error(e);
        } finally {
            dispatch(setIsLoading(false));
        }
    };

    const onDateSelect = async (date) => {
        try {
            dispatch(setIsLoading(true))
            if (date) {
                const d = date.toDate().toLocaleString()
                dispatch(getAllExpensesByDate(d));
            }
        } catch (e) {
            console.error(e)
            showNotification(e.message, "error")
        } finally {
            dispatch(setIsLoading(false))
        }

    }
    const onDelete = async (id: string) => {
        showConfirmation({
            title: "Delete Expense",
            message: "This action cannot be undone. Will take immediate effect. Are you sure you want to delete this expense?",
            onSuccess: async () => {
                try {
                    dispatch(setIsLoading(true));
                    await deleteExpenseByIdAction(id);
                    await fetchExpenses();
                    showNotification("Expense deleted successfully", "success");
                } catch (e) {
                    console.error(e);
                    showNotification(e.message, "error");
                } finally {
                    dispatch(setIsLoading(false));
                }
            }, onClose: () => {
            }
        });
    };

    return (
        <Stack
            direction="column"
            gap={5}
            borderRadius={2}
            boxShadow={2}
            padding={3}
        >
            <Stack
                direction="column"
                alignItems="start"
                justifyContent="center"
                gap={3}
            >
                <Typography variant="h6">Filters</Typography>
                <Stack direction={{xs: "column", md: "row"}} flexWrap={"wrap"} justifyItems={"start"}
                       justifyContent={"start"} gap={3}>
                    <FormControl variant="outlined" size="medium">
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            required
                            label={"Type"}
                            labelId="type-label"
                            value={selectedFilterType}
                            onChange={(e) => dispatch(setSelectedFilterType(e.target.value))}
                        >
                            <MenuItem value={"all"}>All</MenuItem>
                            <MenuItem value="expense">Expense</MenuItem>
                            <MenuItem value="utility">Utility</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="medium">
                        <InputLabel id="for-label">For</InputLabel>
                        <Select
                            required
                            label={"For"}
                            labelId="for-label"
                            value={selectedFilterFor}
                            onChange={(e) => dispatch(setSelectedFilterFor(e.target.value))}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="transport"
                                      disabled={selectedFilterType == "utility"}>Transport</MenuItem>
                            <MenuItem value="rent" disabled={selectedFilterType == "expense"}>Rent</MenuItem>
                            <MenuItem value="salary" disabled={selectedFilterType == "utility"}>Salary</MenuItem>
                            <MenuItem value="ceb" disabled={selectedFilterType == "expense"}>CEB</MenuItem>
                            <MenuItem value="water" disabled={selectedFilterType == "expense"}>Water</MenuItem>
                            <MenuItem value="communication"
                                      disabled={selectedFilterType == "expense"}>Communication</MenuItem>
                            <MenuItem value="food" disabled={selectedFilterType == "utility"}>Food</MenuItem>
                            <MenuItem value="promotions"
                                      disabled={selectedFilterType == "utility"}>Promotions</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Filter by Date" renderInput={(params) => <TextField {...params} fullWidth/>}
                                    onChange={(date) => onDateSelect(date)}/>
                    </LocalizationProvider>
                </Stack>
            </Stack>
            <TableContainer component={Paper}
                            sx={{position: "relative", borderRadius: 2, boxShadow: 2, overflow: "hidden"}}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" component="div" sx={{padding: 2, fontWeight: "bold"}}>
                        Expenses
                    </Typography>
                    <IconButton
                        onClick={fetchExpenses}
                        color={"primary"}
                    >
                        <IoRefreshOutline/>
                    </IconButton>
                </Box>
                <Table sx={{
                    minWidth: 650,
                    "& thead": {
                        backgroundColor: "#f5f5f5",
                        "& th": {
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            fontSize: "0.875rem"
                        }
                    },
                    "& tbody tr:nth-of-type(odd)": {
                        backgroundColor: "#fafafa"
                    },
                    "& tbody tr:hover": {
                        backgroundColor: "#f0f0f0"
                    }
                }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>For</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Note</TableCell>
                            <TableCell>Date Time</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {expenses?.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell
                                    sx={{textTransform: "uppercase", fontWeight: "bold"}}>{expense.id}</TableCell>
                                <TableCell sx={{textTransform: "capitalize"}}>{expense.type}</TableCell>
                                <TableCell sx={{textTransform: "capitalize"}}>{expense.for}</TableCell>
                                <TableCell>LKR {expense.amount}</TableCell>
                                <TableCell>{expense.note || "No Note"}</TableCell>
                                <TableCell>{expense.createdAt}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" size="small"
                                            onClick={() => onDelete(expense.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {isLoading && <ComponentsLoader position="absolute" title="Loading Expenses"/>}
                {!isLoading && expenses.length === 0 && (
                    <EmptyState title="No Expenses Found" subtitle="No expenses have been added yet"/>
                )}
            </TableContainer>
            <Box mt={2} gap={1} display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                <Select defaultValue={size} variant="outlined" size="small"
                        onChange={(event) => dispatch(setSize(event.target.value))}>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>
                <Pagination count={10} variant="outlined" shape="rounded"
                            onChange={(event, page) => dispatch(setPage(page))}/>
            </Box>
            {showExpenseForm && (
                <ExpenseForm
                    open={showExpenseForm}
                    onClose={() => {
                        setShowExpenseForm(false)
                    }}
                />
            )}
        </Stack>
    );
};

export default ExpensesTable;
