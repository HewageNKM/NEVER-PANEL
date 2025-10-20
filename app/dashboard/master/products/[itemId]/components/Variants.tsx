'use client';
import React from 'react';
import {Box, Button, Grid, Stack} from "@mui/material";
import VariantCard from "@/app/dashboard/master/products/[itemId]/components/VariantCard";
import Typography from "@mui/material/Typography";
import EmptyState from "@/app/components/EmptyState";
import AddIcon from '@mui/icons-material/Add';
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {setShowEditingForm} from "@/lib/itemDetailsSlice/itemDetailsSlice"; // Import MUI Add icon

const Variants = () => {
    const {item} = useAppSelector(state => state.itemDetailsSlice);
    const dispatch = useAppDispatch();

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Variants</Typography>
                <Button
                    onClick={() => {
                        dispatch(setShowEditingForm(true))
                    }}
                    type={"button"}
                    variant="contained"
                    startIcon={<AddIcon/>} // Add the icon here
                >
                    Add
                </Button>
            </Stack>
            <Box mt={5}>
                {item?.variants.length === 0 && (
                    <EmptyState
                        title="No Variants Found"
                        subtitle="Add a variant to this item"
                    />
                )}
                {item?.variants.length > 0 && (
                    <Grid container spacing={3}>
                        {item.variants.map((variant, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <VariantCard variant={variant}/>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Stack>
    );
};

export default Variants;
