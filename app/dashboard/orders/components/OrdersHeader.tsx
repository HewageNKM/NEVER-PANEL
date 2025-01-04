import React from 'react';
import {Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField} from '@mui/material';
import Typography from "@mui/material/Typography";
import {IoRefreshCircle} from "react-icons/io5";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {getOrders, setOrders} from "@/lib/ordersSlice/ordersSlice";
import {getAlgoliaClient} from "@/lib/middleware";

const OrdersHeader = () => {
    const dispatch = useAppDispatch();
    const {selectedPage, size} = useAppSelector(state => state.ordersSlice);

    const onSearch = async (evt) => {
        try {
            evt.preventDefault();
            const search = evt.target.search.value;
            const client = getAlgoliaClient();
            const searchResults = await client.search({
                requests: [{indexName: "orders_index", query: search}]
            });
            console.log(searchResults.results[0].hits)
            dispatch(setOrders(searchResults.results[0].hits))
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <Stack direction="column" spacing={2} alignItems="start" justifyContent="space-between" p={2}>
            <Stack>
                <Typography>
                    Options
                </Typography>
            </Stack>
            <Stack direction="row" spacing={5} alignItems="center" justifyContent="space-between" py={2}
                   flexWrap={"wrap"}>
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
                <Stack direction="row" spacing={1} alignItems="center" flexWrap={"wrap"}>
                    {/* Search TextField */}
                    <form onSubmit={onSearch}>
                        <Stack gap={2} display={"flex"} direction={"row"} flexWrap={"wrap"}>
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Search orders..."
                                name={"search"}
                            />
                            <Button type={"submit"} variant="contained" color="primary">
                                Search
                            </Button>
                        </Stack>
                    </form>
                    <IconButton onClick={() => dispatch(getOrders({size, page: selectedPage}))}>
                        <IoRefreshCircle size={30}/>
                    </IconButton>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default OrdersHeader;
