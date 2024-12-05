import React from 'react';
import {Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField} from '@mui/material';
import Typography from "@mui/material/Typography";

const OrdersHeader = () => {
    return (
        <Stack direction="column" spacing={2} alignItems="start" justifyContent="space-between" p={2}>
            <Stack>
                <Typography>
                    Options
                </Typography>
            </Stack>
            <Stack direction="row" spacing={5} alignItems="center" justifyContent="space-between" py={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                    {/* Filter Dropdown */}
                    <FormControl variant="outlined" size="small">
                        <InputLabel id="filter-label">Filter</InputLabel>
                        <Select
                            placeholder={"Filter"}
                            labelId="filter-label"
                            label="Filter"
                            defaultValue="all" // Ensure a default value is set
                        >
                            <MenuItem value={"all"} key="all">All</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Sort Dropdown */}
                    <FormControl variant="outlined" size="small">
                        <InputLabel id="sort-label">Sort</InputLabel>
                        <Select
                            placeholder={"Sort"}
                            labelId="sort-label"
                            label="Sort"
                            defaultValue="none" // Ensure a default value is set
                        >
                            <MenuItem value="none" disabled>
                                Select
                            </MenuItem>
                            <MenuItem value="date_asc">Date (Ascending)</MenuItem>
                            <MenuItem value="date_desc">Date (Descending)</MenuItem>
                            <MenuItem value="total_asc">Total (Low to High)</MenuItem>
                            <MenuItem value="total_desc">Total (High to Low)</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    {/* Search TextField */}
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search orders..."
                    />
                    <Button variant="contained" color="primary">
                        Search
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default OrdersHeader;
