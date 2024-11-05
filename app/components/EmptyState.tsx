import React from 'react';
import {Box, Stack, Typography} from '@mui/material';
import {IoWarningOutline} from "react-icons/io5"; // Optional icon for visual interest

const EmptyState = ({title, subtitle}: { title: string, subtitle: string }) => {
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{
                height: '100%',
                minHeight: 200,
                textAlign: 'center',
                color: 'text.secondary',
                bgcolor: 'background.paper',
                borderRadius: 2,
                p: 4,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
            }}
        >
            <Box sx={{fontSize: 50, color: 'text.disabled'}}>
                <IoWarningOutline/>
            </Box>
            <Typography variant="h6" sx={{fontWeight: 500, color: 'text.primary'}}>
                {title}
            </Typography>
            <Typography variant="body2">
                {subtitle}
            </Typography>
        </Stack>
    );
};

export default EmptyState;
