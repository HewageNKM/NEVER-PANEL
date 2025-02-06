import React, { useState } from "react";
import {
    Box,
    FormControl,
    IconButton,
    Input,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextareaAutosize,
    TextField,
    Typography,
    Button,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker, LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { IoSearchCircle } from "react-icons/io5";
import dayjs from "dayjs";
import { addNewExpense, getAllExpenses, getAllExpensesByDate } from "@/actions/expenseAction";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setExpenses, setSelectedFilterFor, setSelectedFilterType } from "@/lib/expensesSlice/expensesSlice";
import {useSnackbar} from "@/contexts/SnackBarContext";

const Header = () => {
    const dispatch = useAppDispatch();
    const { page, size, selectedFilterFor, selectedFilterType } = useAppSelector(state => state.expensesSlice);
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
            await addNewExpense(newExpense);
            evt.target.reset();
            dispatch(setExpenses(await getAllExpenses(page, size)));
            showNotification("Expense added successfully", "success");
        } catch (e) {
            showNotification(e.message, "error");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Stack sx={{ p: 3, gap: 4, width: "100%", bgcolor: "#f9f9f9", borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h5" fontWeight="bold">Add Expense</Typography>
            <form onSubmit={onSubmit}>
                <Stack spacing={3} direction={{ xs: "column", md: "row" }}>
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
                            <MenuItem disabled={selectedType == "utility"} value="transport">Transport</MenuItem>
                            <MenuItem value="rent" disabled={selectedType == "expense"}>Rent</MenuItem>
                            <MenuItem value="salary" disabled={selectedType == "utility"}>Salary</MenuItem>
                            <MenuItem value="ceb" disabled={selectedType == "expense"}>CEB</MenuItem>
                            <MenuItem value="water" disabled={selectedType == "expense"}>Water</MenuItem>
                            <MenuItem value="communication"
                                      disabled={selectedType == "expense"}>Communication</MenuItem>
                            <MenuItem value="food" disabled={selectedType == "utility"}>Food</MenuItem>
                            <MenuItem disabled={selectedType == "promotions"} value={"promotions"}>Promotions</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField disabled={isLoading} label="Amount" type="number" name="amount" required />
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
                    style={{ width: "100%", padding: "10px", fontSize: "1rem", borderRadius: "5px", border: "1px solid #ccc", marginTop:"10px" }}
                />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "end",
                        mt: 1,
                    }}
                >
                    <Button type="submit" variant="contained" color="primary" disabled={isLoading} sx={{ mt: 2 }}>Add Expense</Button>
                </Box>
            </form>
            <Typography variant="h6">Filters</Typography>
            <Stack direction={{ xs: "column", md: "row" }} flexWrap={"wrap"} justifyItems={"start"} justifyContent={"start"} gap={3}>
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
                    <DatePicker label="Filter by Date" renderInput={(params) => <TextField {...params} fullWidth />} />
                </LocalizationProvider>
                <Box sx={{ display: "flex", alignItems: "center", minWidth: "300px" }}>
                    <Input placeholder="Search" fullWidth/>
                    <IconButton><IoSearchCircle size={30} color="blue" /></IconButton>
                </Box>
            </Stack>
        </Stack>
    );
};

export default Header;