import React, { useState } from 'react';
import { Item } from "@/interfaces";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IoPencil, IoTrashBin } from "react-icons/io5";
import Box from '@mui/material/Box';
import ConfirmationDialog from "@/components/ConfirmationDialog";

const ItemCard = ({ item }: { item: Item }) => {
    const [showDialog, setShowDialog] = useState(false);

    const deleteItem = () => {
        console.log("Deleting item");
    };

    const editItem = () => {
        console.log("Editing item");
    };

    return (
        <Card
            sx={{
                position: "relative",
                maxWidth: 300,
                borderRadius: 2,
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease",
                '&:hover': { transform: "scale(1.02)" },
                bgcolor: "background.default",
            }}
        >
            <CardMedia
                sx={{ height: 160, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                image={item.thumbnail.url}
                title={item.name}
            />
            <CardContent sx={{ p: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 500, textTransform: "capitalize" }}>
                    {item.name}
                </Typography>
                <Box sx={{ display: 'flex',flexDirection:"column",justifyContent: 'start', mt: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: "green", fontWeight: 600 }}>
                        Buying: LKR {item.buyingPrice.toFixed(2)}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: "red", fontWeight: 600 }}>
                        Selling: LKR {item.sellingPrice.toFixed(2)}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex',flexDirection:"column",justifyContent: 'start', mt: 1 ,}}>
                    <Typography variant="caption" sx={{ color: "secondary", fontWeight: 600 }}>
                        Created:{item?.createdAt}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "secondary", fontWeight: 600 }}>
                        Updated:{item?.updatedAt}
                    </Typography>
                </Box>
                <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
                    Variants: {item.variants.length}
                </Typography>
            </CardContent>
            <Box sx={{ position: "absolute", top: 0, right: 0 }}>
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
            <Box sx={{ position: "absolute", top: 0, left: 0, display: "flex", gap: 0.5, flexDirection: "column" }}>
                <Typography
                    variant="caption"
                    sx={{
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
            <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                <Button variant="text" color="primary" size="small" startIcon={<IoPencil size={18} />} onClick={editItem}>
                    Edit
                </Button>
                <Button onClick={() => setShowDialog(true)} variant="text" color="error" size="small" startIcon={<IoTrashBin size={18} />}>
                    Delete
                </Button>
            </CardActions>
            <ConfirmationDialog
                title={"Delete Item"}
                body={"Are you sure you want to delete this item? This action cannot be undone and will also delete all associated variants and files."}
                onConfirm={deleteItem}
                onCancel={() => setShowDialog(false)} open={showDialog}
            />
        </Card>
    );
};

export default ItemCard;
