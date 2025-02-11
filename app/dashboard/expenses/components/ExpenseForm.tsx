import React, {useState} from 'react';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextareaAutosize,
    TextField
} from "@mui/material";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useSnackbar} from "@/contexts/SnackBarContext";
import {addNewExpenseAction} from "@/actions/expenseActions";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import dayjs from "dayjs";
import DialogActions from "@mui/material/DialogActions";
import {getAllExpenses} from "@/lib/expensesSlice/expensesSlice";

const ExpenseForm = ({open, onClose}: { open: boolean, onClose: () => void }) => {
    const dispatch = useAppDispatch();
    const {page, size} = useAppSelector(state => state.expensesSlice);
    const [selectedType, setSelectedType] = useState("expense");
    const [selectedFor, setSelectedFor] = useState("food");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
    const {showNotification} = useSnackbar();

    const onSubmit = async (evt) => {
        evt.preventDefault();
        setIsLoading(true);
        try {
            const note = evt.target.note.value || "";
            const newExpense = {
                id: "ex-" + Math.random().toString(36).substring(2, 6),
                type: selectedType,
                for: selectedFor,
                note,
                amount: parseFloat(evt.target.amount.value),
                createdAt: selectedDateTime.toDate().toISOString(),
            };
            await addNewExpenseAction(newExpense);
            evt.target.reset();
            dispatch(getAllExpenses({page, size}));
            showNotification("Expense added successfully", "success");
        } catch (e) {
            showNotification(e.message, "error");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogContent>
                <DialogTitle>
                    Expense Form
                </DialogTitle>
                <Stack
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        padding: "20px",
                    }}
                >
                    <form onSubmit={onSubmit}>
                        <Stack spacing={3} direction={{xs: "column", md: "row"}}>
                            <FormControl variant="outlined" size="medium">
                                <InputLabel id="type-label">Type</InputLabel>
                                <Select
                                    disabled={isLoading}
                                    required
                                    labelId="type-label"
                                    label={"Type"}
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <MenuItem value="expense">Expense</MenuItem>
                                    <MenuItem value="utility">Utility</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" size="medium">
                                <InputLabel id="for-label">For</InputLabel>
                                <Select
                                    disabled={isLoading}
                                    required
                                    label={"For"}
                                    labelId="for-label"
                                    value={selectedFor}
                                    onChange={(e) => setSelectedFor(e.target.value)}
                                >
                                    <MenuItem disabled={selectedType == "utility"}
                                              value="transport">Transport</MenuItem>
                                    <MenuItem value="rent" disabled={selectedType == "expense"}>Rent</MenuItem>
                                    <MenuItem value="salary" disabled={selectedType == "utility"}>Salary</MenuItem>
                                    <MenuItem value="ceb" disabled={selectedType == "expense"}>CEB</MenuItem>
                                    <MenuItem value="water" disabled={selectedType == "expense"}>Water</MenuItem>
                                    <MenuItem value="communication"
                                              disabled={selectedType == "expense"}>Communication</MenuItem>
                                    <MenuItem value="food" disabled={selectedType == "utility"}>Food</MenuItem>
                                    <MenuItem disabled={selectedType == "promotions"}
                                              value={"promotions"}>Promotions</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField disabled={isLoading} label="Amount" type="number" name="amount" required/>
                            <Box>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        disabled={isLoading}
                                        value={selectedDateTime}
                                        onChange={(newValue) => setSelectedDateTime(newValue)}
                                        label="Select Date & Time"
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Box>
                        </Stack>
                        <TextareaAutosize
                            minRows={5}
                            name="note"
                            placeholder="Note"
                            style={{
                                width: "100%",
                                padding: "10px",
                                fontSize: "1rem",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                marginTop: "10px"
                            }}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "end",
                                alignItems: "end",
                                mt: 1,
                            }}
                        >
                        </Box>
                        <DialogActions>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>Add</Button>
                        </DialogActions>
                    </form>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default ExpenseForm;