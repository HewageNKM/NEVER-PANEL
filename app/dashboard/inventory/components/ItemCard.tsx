"use client"
import React, {useState} from 'react';
import {Item} from "@/interfaces";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {IoPencil, IoTrashBin} from "react-icons/io5";
import Box from '@mui/material/Box';
import ConfirmationDialog from "@/components/ConfirmationDialog";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {deleteAItem} from "@/actions/inventoryActions";
import {getInventoryItems} from "@/lib/inventorySlice/inventorySlice";
import {useRouter} from "next/navigation";
import ComponentsLoader from "@/app/components/ComponentsLoader";

const ItemCard = ({item, onEdit}: { item: Item, onEdit: any }) => {
    const [showConfirmedDialog, setShowConfirmedDialog] = useState(false);
    const {page, size} = useAppSelector(state => state.inventorySlice);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const deleteItem = async () => {
        try {
            setIsLoading(true);
            setShowConfirmedDialog(false);
            await deleteAItem(item.itemId);
        } catch (e: any) {
            console.error(e)
        } finally {
            setIsLoading(false);
            dispatch(getInventoryItems({size: size, page: page}))
        }
    };


    return (
        <Card
            sx={{
                position: "relative",
                maxWidth: 300,
                borderRadius: 2,
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease",
                '&:hover': {transform: "scale(1.02)"},
                bgcolor: "background.default",
            }}
        >
            <Box sx={{position: "relative"}}>
                <CardMedia
                    onClick={() => router.push(`/dashboard/inventory/${item.itemId}`)}
                    sx={{height: 160, borderTopLeftRadius: 8, borderTopRightRadius: 8}}
                    image={item.thumbnail.url}
                    title={item.name}
                />
                {item.status == "Inactive" && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h6" sx={{color: "white"}}>
                            Inactive
                        </Typography>
                    </Box>
                )}
            </Box>
            <CardContent sx={{p: 1}}>
                <Typography variant="body2" sx={{color: "text.secondary", textTransform: "uppercase"}}>
                    {item.itemId}
                </Typography>
                <Typography variant="h5" sx={{fontWeight: 500, textTransform: "capitalize"}}>
                    {item.name}
                </Typography>
                <Box mt={1}>
                    <Typography>
                        Buying: LKR {item.buyingPrice}
                    </Typography>
                    <Typography>
                        Selling: LKR {item.sellingPrice}
                    </Typography>
                </Box>
                <Box>
                    <Typography>
                        Status: {item.status}
                    </Typography>
                    <Typography>
                        Listings: {item.listing}
                    </Typography>
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        mt: 1,
                        color: "text.secondary",
                        display: "flex",
                        justifyContent: "flex-end", // Aligns to the right
                        alignItems: "center",      // Center alignment vertically if needed
                    }}
                >
                    {item.variants.length}
                </Typography>
            </CardContent>
            <Box sx={{position: "absolute", top: 0, right: 0}}>
                <Typography
                    variant="caption"
                    sx={{
                        bgcolor: "yellowgreen", // Distinct color for item type
                        textTransform: "capitalize",
                        color: "white",
                        p: 1,
                        borderRadius: 1,
                    }}
                >
                    {item.type}
                </Typography>
            </Box>
            <Box sx={{position: "absolute", top: 0, left: 0, display: "flex", gap: 0.5, flexDirection: "column"}}>
                <Typography
                    variant="caption"
                    sx={{
                        width: "fit-content",
                        bgcolor: "#4caf50", // Green color for manufacturer
                        textTransform: "capitalize",
                        color: "white",
                        p: 0.3,
                        borderRadius: 1,
                    }}
                >
                    {item.manufacturer}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        width: "fit-content",
                        bgcolor: "#2196f3", // Blue color for brand
                        textTransform: "capitalize",
                        color: "white",
                        p: 0.3,
                        borderRadius: 1,
                    }}
                >
                    {item.brand}
                </Typography>
            </Box>
            <CardActions sx={{justifyContent: "space-between", px: 2, pb: 2}}>
                <Button variant="text" color="primary" size="small" startIcon={<IoPencil size={18}/>} onClick={onEdit}>
                    Edit
                </Button>
                <Button onClick={() => setShowConfirmedDialog(true)} variant="text" color="error" size="small"
                        startIcon={<IoTrashBin size={18}/>}>
                    Delete
                </Button>
            </CardActions>
            <ConfirmationDialog
                title={"Delete Item"}
                body={"Are you sure you want to delete this item? This action cannot be undone and will also delete all associated variants and files."}
                onConfirm={deleteItem}
                onCancel={() => setShowConfirmedDialog(false)} open={showConfirmedDialog}
            />
            {isLoading && (<ComponentsLoader title={"Working"}/>)}
        </Card>
    );
};


export default ItemCard;
