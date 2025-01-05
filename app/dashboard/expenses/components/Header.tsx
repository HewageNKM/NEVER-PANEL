import React, { useState } from "react";
import {Box, FormControl, Input, InputLabel, MenuItem, Select, Stack, Typography} from "@mui/material";
import HeaderCard from "@/app/dashboard/components/shared/HeaderCard";
import Button from "@mui/material/Button";

const Header = () => {
    const [isCardLoading, setIsCardLoading] = useState(true);
    const [totalExpenseCount, setTotalExpenseCount] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [selectedType, setSelectedType] = useState(""); // Default value as an empty string
    const [selectedFor, setSelectedFor] = useState(""); // Default value as an empty string

    return (
        <Stack
            sx={{
                position: "relative",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
                alignItems: "center", // Center align content
            }}
        >
            {/* Expense Summary */}
            <Box>
                <HeaderCard
                    title="Total Expenses"
                    value={totalExpense}
                    startDate={new Date().toDateString()}
                    endDate={new Date().toLocaleString()}
                    isLoading={isCardLoading}
                    invoices={totalExpenseCount}
                />
            </Box>

            {/* Add Expense Form */}
            <form>
                <Stack
                    sx={{
                        backgroundColor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 1,
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
                    <Stack gap={1}>
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="type-label">Type</InputLabel>
                            <Select
                                placeholder={"Type"}
                                labelId="type-label"
                                label="Type"
                                defaultValue="expense" // Ensure a default value is set
                            >

                                <MenuItem value={"expense"} key="expense">Expense</MenuItem>
                                <MenuItem value="utility">Utility</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>

                    {/* Expense Details */}
                    <Stack gap={1}>
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="for-label">For</InputLabel>
                            <Select
                                placeholder={"For"}
                                labelId="for-label"
                                label="For"
                                defaultValue="" // Ensure a default value is set
                            >
                                <MenuItem value="transport">Transport</MenuItem>
                                <MenuItem value="rent">Rent</MenuItem>
                                <MenuItem value="salary">Salary</MenuItem>
                                <MenuItem value="ceb">CEB</MenuItem>
                                <MenuItem value="water">Water</MenuItem>
                                <MenuItem value="communication">Communication</MenuItem>
                                <MenuItem value="food">Food</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>

                    {/* Amount Input */}
                    <Stack gap={1}>
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="amount-label">Amout</InputLabel>
                            <Input
                                type={"number"}
                                label="amount"
                            />
                        </FormControl>
                    </Stack>

                    {/* Submit Button */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            flex: "1 1 100%",
                            marginTop: 2,
                        }}
                    >
                        <Button type="submit" variant="contained" color="primary">
                            Add Expense
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Stack>
    );
};

export default Header;
