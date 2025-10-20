"use client";

import React, { useEffect } from "react";
import {
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Box,
  Paper,
} from "@mui/material";
import { IoSearchCircle } from "react-icons/io5";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getOrders,
  setLoading,
  setOrders,
  setSelectedFilterStatus,
  setSelectedFilterTracking,
} from "@/lib/ordersSlice/ordersSlice";
import { getAlgoliaClient } from "@/lib/algoliaConfig";
import { getOrdersByDateAction } from "@/actions/ordersActions";
import { paymentStatusList } from "@/constant";
import { useSnackbar } from "@/contexts/SnackBarContext";

const OrdersHeader = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.authSlice);
  const {
    selectedPage,
    size,
    selectedFilterStatus,
    selectedFilterTracking,
  } = useAppSelector((state) => state.ordersSlice);
  const { showNotification } = useSnackbar();

  // --- Search handler ---
  const onSearch = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    try {
      dispatch(setLoading(true));
      const search = (evt.currentTarget as any).search.value;
      const client = getAlgoliaClient();
      const searchResults = await client.search({
        requests: [{ indexName: "orders_index", query: search }],
      });
      const orders = searchResults.results[0].hits.map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt).toLocaleString(),
      }));
      dispatch(setOrders(orders));
    } catch (err: any) {
      console.error(err);
      showNotification(err.message, "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // --- Date filter handler ---
  const onDatePick = async (date: any) => {
    try {
      dispatch(setLoading(true));
      if (date) {
        const d = date.toDate().toLocaleString();
        const orders = await getOrdersByDateAction(d);
        dispatch(setOrders(orders));
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message, "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (currentUser) {
      dispatch(getOrders({ size, page: selectedPage }));
    }
  }, [currentUser, selectedFilterTracking, selectedFilterStatus]);

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={600}>
          Orders Management
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          {/* Filters */}
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {/* Status Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedFilterStatus}
                label="Status"
                onChange={(e) =>
                  dispatch(setSelectedFilterStatus(e.target.value))
                }
              >
                <MenuItem value="all">All</MenuItem>
                {paymentStatusList.map((status) => (
                  <MenuItem key={status.id} value={status.value}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Tracking Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Track</InputLabel>
              <Select
                value={selectedFilterTracking}
                label="Track"
                onChange={(e) =>
                  dispatch(setSelectedFilterTracking(e.target.value))
                }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="complete">Complete</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* Search */}
          <Box component="form" onSubmit={onSearch} display="flex" gap={1}>
            <TextField
              size="small"
              placeholder="Search orders..."
              name="search"
            />
            <IconButton color="primary" type="submit">
              <IoSearchCircle size={28} />
            </IconButton>
          </Box>

          {/* Date Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Filter by Date"
              onChange={onDatePick}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
          </LocalizationProvider>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default OrdersHeader;
