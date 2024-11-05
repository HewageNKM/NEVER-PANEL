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

const ItemCard = ({item}: { item: Item }) => {
    const [showDialog, setShowDialog] = useState(false)

    const deleteItem = () => {
        console.log("Deleting item")
    }
    const editItem = () => {

    }
    return (
        <Card
            sx={{
                maxWidth: 300,
                borderRadius: 2,
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease",
                '&:hover': {transform: "scale(1.02)"},
                bgcolor: "background.default",
            }}
        >
            <CardMedia
                sx={{height: 160, borderTopLeftRadius: 8, borderTopRightRadius: 8}}
                image={item.thumbnail.url}
                title={item.name}
            />
            <CardContent sx={{p: 2}}>
                <Typography variant="h6" sx={{fontWeight: 500, textTransform: "capitalize"}}>
                    {item.name}
                </Typography>
                <Typography variant="body2" sx={{color: 'text.secondary', mb: 1}}>
                    {item.brand}
                </Typography>
                <Typography variant="body2"
                            sx={{fontSize: 15, color: 'text.secondary', mb: 1, textTransform: "capitalize"}}>
                    {item.manufacturer}
                </Typography>
                <Box flexWrap={"wrap"} justifyContent="space-between" alignItems="center" sx={{mb: 1, mt: 2}}>
                    <Typography variant="body2" sx={{color: 'text.primary', fontWeight: 600}}>
                        Sell: LKR {item.sellingPrice}
                    </Typography>
                    <Typography variant="caption" sx={{color: 'text.secondary'}}>
                        Buy: LKR {item.buyingPrice}
                    </Typography>
                </Box>
                <Box display={"flex"} flexDirection={"column"} justifyItems={"start"} alignItems={"start"}>
                    <Typography variant="caption" sx={{color: 'text.secondary'}}>
                        Created: {item.createdAt?.toString()}
                    </Typography>
                    <Typography variant="caption" sx={{color: 'text.secondary'}}>
                        Updated: {item.updatedAt?.toString()}
                    </Typography>
                </Box>
                <Typography variant={"body2"} sx={{
                    mt: 2,

                    color: "text.primary",
                }}>
                    Variants: {item.variants.length}
                </Typography>
            </CardContent>
            <CardActions sx={{justifyContent: "space-between", px: 2, pb: 2}}>
                <Button variant="text" color="primary" size="small" startIcon={<IoPencil size={18}/>}>
                    Edit
                </Button>
                <Button onClick={()=>setShowDialog(true)} variant="text" color="error" size="small" startIcon={<IoTrashBin size={18}/>}>
                    Delete
                </Button>
            </CardActions>
            <ConfirmationDialog
                title={"Delete Item"}
                body={"Are you sure you want to delete this item?, this action cannot be undone also delete all the variants and files associated with this item"}
                onConfirm={deleteItem}
                onCancel={()=>setShowDialog(false)} open={showDialog}
            />
        </Card>
    );
};

export default ItemCard;
