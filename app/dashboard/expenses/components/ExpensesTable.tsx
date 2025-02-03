import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
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
    Typography
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setExpenses, setPage, setSize } from '@/lib/expensesSlice/expensesSlice';
import { deleteExpenseById, getAllExpenses } from "@/actions/expenseAction";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import EmptyState from "@/app/components/EmptyState";

const ExpensesTable = () => {
    const dispatch = useAppDispatch();
    const { page, size, expenses, selectedFilterType, selectedFilterFor } = useAppSelector(state => state.expensesSlice);
    const { currentUser } = useAppSelector(state => state.authSlice);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            fetchExpenses();
        }
    }, [currentUser, page, size, selectedFilterFor, selectedFilterType]);

    const fetchExpenses = async () => {
        try {
            setIsLoading(true);
            const exps = await getAllExpenses(page, size);
            dispatch(setExpenses(exps));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async (id) => {
        const res = confirm("Are you sure you want to delete this expense?");
        if (!res) return;

        try {
            setIsLoading(true);
            await deleteExpenseById(id);
            await fetchExpenses();
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Stack direction="column" gap={5}>
            <TableContainer component={Paper} sx={{ position: "relative", borderRadius: 2, boxShadow: 2, overflow: "hidden" }}>
                <Typography variant="h6" component="div" sx={{ padding: 2, fontWeight: "bold" }}>
                    Expenses
                </Typography>
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
                                <TableCell sx={{ textTransform: "uppercase", fontWeight: "bold" }}>{expense.id}</TableCell>
                                <TableCell sx={{ textTransform: "capitalize" }}>{expense.type}</TableCell>
                                <TableCell sx={{ textTransform: "capitalize" }}>{expense.for}</TableCell>
                                <TableCell>LKR {expense.amount}</TableCell>
                                <TableCell>{expense.note || "No Note"}</TableCell>
                                <TableCell>{expense.createdAt}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" size="small" onClick={() => onDelete(expense.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {isLoading && <ComponentsLoader position="absolute" title="Loading Expenses" />}
                {!isLoading && expenses.length === 0 && (
                    <EmptyState title="No Expenses Found" subtitle="No expenses have been added yet" />
                )}
            </TableContainer>
            <Box mt={2} gap={1} display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                <Select defaultValue={size} variant="outlined" size="small" onChange={(event) => dispatch(setSize(event.target.value))}>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>
                <Pagination count={10} variant="outlined" shape="rounded" onChange={(event, page) => dispatch(setPage(page))} />
            </Box>
        </Stack>
    );
};

export default ExpensesTable;
