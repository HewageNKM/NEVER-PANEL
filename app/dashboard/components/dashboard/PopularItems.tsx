import {Item} from "@/interfaces";
import {Grid, Typography,} from "@mui/material";
import {useEffect, useState} from "react";
import {useAppSelector} from "@/lib/hooks";

const PopularItems = () => {
    const [items, setItems] = useState<Item[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const {currentUser} = useAppSelector(state => state.authSlice);

    useEffect(() => {
        fetchPopularItems();
    }, [currentUser]);

    const fetchPopularItems = async () => {

    }
    return (
        <Grid container spacing={3} mt={2}>
            <Grid item xs={12} mb={3}>
                <Typography
                    variant="h4"
                    sx={{fontWeight: 'bold', marginBottom: 2}}
                >
                    Popular Products
                </Typography>
            </Grid>
        </Grid>
    );
};

export default PopularItems;
