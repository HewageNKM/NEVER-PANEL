import React from 'react';
import {Item} from "@/interfaces";
import {Box, Grid, Stack} from "@mui/material";
import VariantCard from "@/app/dashboard/inventory/[itemId]/components/VariantCard";
import Typography from "@mui/material/Typography";
import EmptyState from "@/app/components/EmptyState";

const Variants = ({item}:{item:Item}) => {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h5">Variants</Typography>

            </Box>
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
                                <VariantCard variant={variant} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Stack>
    );
};

export default Variants;