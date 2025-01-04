import React from 'react';
import {Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField} from '@mui/material';
import Typography from "@mui/material/Typography";
import {IoRefreshCircle} from "react-icons/io5";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {getOrders, setOrders} from "@/lib/ordersSlice/ordersSlice";
import {getAlgoliaClient} from "@/lib/middleware";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {getOrdersByDate} from "@/actions/ordersActions";

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
            const getDate = (date) => {
                return new Date(date).toLocaleString()
            }
            const orders = searchResults.results[0].hits.map(order => {
                return {
                    ...order,
                    createdAt:getDate(order.createdAt)
                }
            })
            dispatch(setOrders(orders))
        } catch (e) {
            console.error(e)
        }
    }
    const onDatePick = async (date) => {
        try {
            if(date){
                const d = date.toDate().toLocaleString()
                const orders = await getOrdersByDate(d);
                console.log(orders)
                dispatch(setOrders(orders))
            }
        }catch (e) {
            console.error(e)
        }
    }
    return (
        <Stack direction="column" spacing={2} alignItems="start" flexWrap={"wrap"} justifyContent="space-between" p={2}>
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
                            <MenuItem value="complete">Complete</MenuItem>
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date"
                        onChange={onDatePick}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Stack>
        </Stack>
    );
};

export default OrdersHeader;
