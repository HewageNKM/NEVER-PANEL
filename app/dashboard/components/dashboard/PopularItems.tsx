import {PopularItem} from "@/interfaces";
import {Box, CircularProgress, Grid, IconButton, MenuItem, Select, Stack, Typography,} from "@mui/material";
import {useEffect, useState} from "react";
import {useAppSelector} from "@/lib/hooks";
import {getPopularItemsAction} from "@/actions/inventoryActions";
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import PopularItemCard from "@/app/dashboard/components/dashboard/PopularItemCard";
import {IoRefresh} from "react-icons/io5";
import {useSnackbar} from "@/contexts/SnackBarContext";

const PopularItems = () => {
    const [items, setItems] = useState<PopularItem[] | null>([])
    const [isLoading, setIsLoading] = useState(true);
    const {currentUser} = useAppSelector(state => state.authSlice);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth()
    )
    const {showNotification} = useSnackbar();
    const months = [
        {
            value: 0,
            label: "January",
        },
        {
            value: 1,
            label: "February",
        },
        {
            value: 2,
            label: "March",
        },
        {
            value: 3,
            label: "April",
        },
        {
            value: 4,
            label: "May",
        },
        {
            value: 5,
            label: "June",
        },
        {
            value: 6,
            label: "July",
        },
        {
            value: 7,
            label: "August",
        },
        {
            value: 8,
            label: "September",
        },
        {
            value: 9,
            label: "October",
        },
        {
            value: 10,
            label: "November",
        },
        {
            value: 11,
            label: "December",
        },
    ]
    useEffect(() => {
        if (currentUser) {
            fetchPopularItems();
        }
    }, [currentUser, selectedMonth]);

    const fetchPopularItems = async () => {
        try {
            setIsLoading(true);
            const items: PopularItem[] = await getPopularItemsAction(20,selectedMonth);
            setItems(items);
        } catch (e) {
            console.error(e);
            showNotification(e.message, "error");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <DashboardCard>
            <Grid item xs={12} mb={3}>
                <Stack
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 2
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{fontWeight: 'bold'}}
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
                    <Box>
                        <Select
                            variant={"outlined"}
                            defaultValue={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number.parseInt(e.target.value))}
                        >
                            {months.map((month) => (
                                <MenuItem key={month.value} value={month.value}>
                                    {month.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Stack>
                {isLoading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100px"
                    >
                        <CircularProgress/>
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {items?.map((item: PopularItem) => (
                            <Grid
                                item
                                xs={6} sm={4} md={3} // Adjust grid columns per screen size
                                key={item.item.itemId}
                            >
                                <PopularItemCard item={item}/>
                            </Grid>
                        ))}
                    </Grid>
                )}

            </Grid>
        </DashboardCard>
    );
};

export default PopularItems;
