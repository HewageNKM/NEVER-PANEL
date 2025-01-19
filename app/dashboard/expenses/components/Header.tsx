import React, {useState} from "react";
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
} from "@mui/material";
import Button from "@mui/material/Button";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {IoSearchCircle} from "react-icons/io5";
import {Expense} from "@/interfaces";
import {addNewExpense, getAllExpenses, getAllExpensesByDate} from "@/actions/expenseAction";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {setExpenses, setSelectedFilterFor, setSelectedFilterType} from "@/lib/expensesSlice/expensesSlice";

const Header = () => {

    const dispatch = useAppDispatch();
    const {page, size, selectedFilterFor, selectedFilterType} = useAppSelector(state => state.expensesSlice);
    const [selectedType, setSelectedType] = useState("expense");
    const [selectedFor, setSelectedFor] = useState("food");
    const [isLoading, setIsLoading] = useState(false)

    const [selectedDateTime, setSelectedDateTime] = useState(dayjs());

    const onSubmit = async (evt) => {
        try {
            setIsLoading(true)
            evt.preventDefault();
            const note = evt.target.note.value || "";

            const newExpense: Expense = {
                id: "ex-" + Math.random().toString(36).substring(2, 6),
                type: selectedType,
                for: selectedFor,
                note:note,
                amount: parseFloat(evt.target.amount.value),
                createdAt: selectedDateTime.toDate().toISOString(),
            }
            await addNewExpense(newExpense);
            evt.target.reset();
            const expenses = await getAllExpenses(page, size);
            dispatch(setExpenses(expenses))
        } catch (e) {
            console.error(e)
        }finally {
            setIsLoading(false)
        }
    }
    const onDateSelect = async (evt) => {
        try {
            const from = evt.toDate();
            from.setHours(0, 0, 0);
            const to = evt.toDate();
            to.setHours(23, 59, 59);
            const allExpensesByDate = await getAllExpensesByDate(from.toLocaleString(), to.toLocaleString());
            dispatch(setExpenses(allExpensesByDate))
        }catch (e) {
            console.error(e)
        }
    }
    return (
        <Stack
            sx={{
                position: "relative",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
                alignItems: "start",
            }}
        >
            {/* Add Expense Form */}
            <form onSubmit={onSubmit}>
                <Stack
                    sx={{
                        padding: 3,
                        gap: 3,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-evenly",
                        alignItems: "flex-start",
                        width: "fit-content",
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            flex: "1 1 100%",
                            textAlign: "left",
                            marginBottom: 2,
                        }}
                    >
                        Add Expense
                    </Typography>

                    {/* Type Selector */}
                    <Box>
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
                    </Box>

                    {/* Expense Details */}
                    <Box>
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
                                <MenuItem disabled={selectedType == "promotions"}>Promotions</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Amount Input */}
                    <Box>
                        <FormControl variant="outlined" size="medium">
                            <InputLabel htmlFor="amount-input">Amount</InputLabel>
                            <Input
                                disabled={isLoading}
                                required
                                id="amount-input"
                                type="number"
                                name={"amount"}
                            />
                        </FormControl>
                    </Box>

                    <Box>
                        <TextareaAutosize
                            aria-label="note-label"
                            placeholder="Note"
                            minRows={4}
                            name="note"
                            disabled={isLoading}
                            style={{
                                width: "100%", // Makes it responsive to parent container
                                maxWidth: "500px", // Optional: sets a maximum width
                                padding: "8px", // Adds padding inside the textarea
                                fontSize: "1rem", // Adjusts the font size
                                border: "1px solid #ccc", // Adds a border
                                borderRadius: "4px", // Adds rounded corners
                                resize: "vertical", // Allows vertical resizing only
                                backgroundColor: "#fff", // Optional: sets background color
                            }}
                        />
                    </Box>

                    {/* Date and Time Picker */}
                    <Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                disabled={isLoading}                                value={selectedDateTime}
                                onChange={(newValue) => setSelectedDateTime(newValue)}
                                label="Select Date & Time"
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Box>
                    {/* Submit Button */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            flex: "1 1 100%",
                            marginTop: 2,
                        }}
                    >
                        <Button type="submit" className="disabled:cursor-not-allowed disabled:bg-opacity-60"  disabled={isLoading} variant="contained" color="primary">
                            Add Expense
                        </Button>
                    </Box>
                </Stack>
            </form>
            <Stack sx={{
                display: "flex",
                direction: "row",
                flexWrap: "wrap"
            }}>
                <Typography variant={"h6"}>Options</Typography>
                <Stack mt={3} sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    width: "100%",
                }}>
                    <Box>
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
                    </Box>
                    <Box>
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
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date"
                            onChange={onDateSelect}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <Box>
                        <form>
                            <Stack sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 2,
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                            }}>
                                <Input type={"text"} placeholder={"Search"}/>
                                <IconButton>
                                    <IoSearchCircle size={30} color={"blue"}/>
                                </IconButton>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default Header;
