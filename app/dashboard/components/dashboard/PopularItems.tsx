import {PopularItem} from "@/interfaces";
import {Box, CircularProgress, Grid, IconButton, Stack, Typography,} from "@mui/material";
import {useEffect, useState} from "react";
import {useAppSelector} from "@/lib/hooks";
import {getPopularItems} from "@/actions/inventoryActions";
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import PopularItemCard from "@/app/dashboard/components/dashboard/PopularItemCard";
import {IoRefresh} from "react-icons/io5";

const PopularItems = () => {
    const [items, setItems] = useState<PopularItem[] | null>([])
    const [isLoading, setIsLoading] = useState(true);
    const {currentUser} = useAppSelector(state => state.authSlice);

    useEffect(() => {
        if (currentUser) {
            fetchPopularItems();
        }
    }, [currentUser]);

    const fetchPopularItems = async () => {
        try {
            setIsLoading(true);
            const items: PopularItem[] = await getPopularItems(20);
            setItems(items);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <DashboardCard>
            <Grid item xs={12} mb={3}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography
                        variant="h4"
                        sx={{fontWeight: 'bold', marginBottom: 2}}
                    >
                        Popular Products
                    </Typography>
                    <IconButton
                        onClick={fetchPopularItems}
                        color="primary"
                        aria-label="refresh"
                    >
                        <IoRefresh/>
                    </IconButton>
                </Box>
                {isLoading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100px"
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {items?.map((item: PopularItem) => (
                            <Grid
                                item
                                xs={6} sm={4} md={3} // Adjust grid columns per screen size
                                key={item.item.itemId}
                            >
                                <PopularItemCard item={item} />
                            </Grid>
                        ))}
                    </Grid>
                )}

            </Grid>
        </DashboardCard>
    );
};

export default PopularItems;
