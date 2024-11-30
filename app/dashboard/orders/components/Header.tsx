import { Box, Stack, Typography, Select, MenuItem, IconButton } from '@mui/material';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import React from 'react';

const Header = () => {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} p={2}>
            {/* Filters Section */}
            <Box display="flex" alignItems="center" gap={2}>
                {/* Status Filter */}
                <Box>
                    <Typography variant="body2">Status:</Typography>
                    <Select defaultValue="all" size="small">
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="pending">Processing</MenuItem>
                        <MenuItem value="shipped">Dispatch</MenuItem>
                    </Select>
                </Box>

                {/* Date Range Filter */}
                <Box>
                    <Typography variant="body2">Date Range:</Typography>
                    <Select defaultValue="all" size="small">
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="this_week">This Week</MenuItem>
                        <MenuItem value="this_month">This Month</MenuItem>
                    </Select>
                </Box>
            </Box>

            {/* Sorting Section */}
            <Box display="flex" alignItems="center" gap={2}>
                {/* Sort by Order ID */}
                <Box display="flex" alignItems="center">
                    <Typography variant="body2">Order ID:</Typography>
                    <IconButton size="small">
                        <ArrowUpward fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                        <ArrowDownward fontSize="small" />
                    </IconButton>
                </Box>

                {/* Sort by Date */}
                <Box display="flex" alignItems="center">
                    <Typography variant="body2">Date:</Typography>
                    <IconButton size="small">
                        <ArrowUpward fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                        <ArrowDownward fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Stack>
    );
};

export default Header;
