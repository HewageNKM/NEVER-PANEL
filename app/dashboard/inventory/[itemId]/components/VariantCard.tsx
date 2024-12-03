"use client"
import React, {useState} from "react";
import {Box, Button, Card, CardActions, CardContent, Stack, Typography} from "@mui/material";
import {Item, Variant} from "@/interfaces";
import "swiper/css";
import ImageSlider from "@/app/dashboard/inventory/[itemId]/components/ImageSlider";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import {useDispatch} from "react-redux";
import {setItem, setSelectedVariant, setShowEditingForm} from "@/lib/itemDetailsSlice/itemDetailsSlice";
import {useAppSelector} from "@/lib/hooks";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import {deleteAFile, updateAItem} from "@/actions/inventoryActions";

const VariantCard = ({variant}: { variant: Variant }) => {
    const {item} = useAppSelector(state => state.itemDetailsSlice);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showConfirmedDialog, setShowConfirmedDialog] = useState(false)
    const dispatch = useDispatch();

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    const handleEdit = () => {
        dispatch(setSelectedVariant(variant))
        dispatch(setShowEditingForm(true))
    };


    const deleteVariant = async () => {
        try {
            if (!item) {
                new Error("Item not found")
            }

            setShowConfirmedDialog(false)
            const filteredVariants = item?.variants.filter(v => v.variantId !== variant.variantId)
            const updatedItem = {...item, variants: filteredVariants}
            for (const image of variant.images) {
                await deleteAFile(`inventory/${item?.itemId}/${variant.variantId}/${image.file}`);
            }

            await updateAItem(updatedItem)
            dispatch(setItem(updatedItem))
        } catch (e: any) {
            console.error(e)
        }
    };


    return (
        <Card
            sx={{
                maxWidth: 200,
                boxShadow: 3,
                borderRadius: 2,
                overflow: "hidden",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 5,
                },
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: 200,
                    overflow: "hidden",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <ImageSlider images={variant?.images}/>
            </Box>
            <CardContent>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        color: "text.primary",
                        mb: 1,
                        textTransform: "capitalize",
                    }}
                >
                    {variant.variantName}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: "text.secondary",
                        mb: 2,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                    }}
                >
                    ID: {variant.variantId}
                </Typography>
                <Stack
                    direction="column"
                    spacing={1}
                    sx={{borderTop: "1px solid #e0e0e0", pt: 2}}
                >
                    <Typography variant={"h6"}>Sizes</Typography>
                    {isExpanded ? (
                        variant.sizes.map((size, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    fontSize: "0.9rem",
                                }}
                            >
                                <Typography>{size.size}</Typography>
                                <Typography>{size.stock} in stock</Typography>
                            </Box>
                        ))
                    ) : (
                        variant.sizes.slice(0, 2).map((size, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    fontSize: "0.9rem",
                                }}
                            >
                                <Typography>{size.size}</Typography>
                                <Typography>{size.stock} in stock</Typography>
                            </Box>
                        ))
                    )}
                    {variant.sizes.length > 2 && (
                        <Button
                            onClick={toggleExpand}
                            size="small"
                            sx={{textTransform: "capitalize", mt: 1}}
                        >
                            {isExpanded ? "Show Less" : "Show More"}
                        </Button>
                    )}
                </Stack>
            </CardContent>
            <CardActions
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingX: 2,
                    paddingY: 1,
                    borderTop: "1px solid #e0e0e0",
                }}
            >
                <Button
                    size="small"
                    color="primary"
                    variant={"outlined"}
                    onClick={handleEdit}
                    sx={{textTransform: "capitalize"}}
                >
                    Edit
                </Button>
                <Button
                    size="small"
                    color="error"
                    variant={"contained"}
                    onClick={() => setShowConfirmedDialog(true)}
                    sx={{textTransform: "capitalize"}}
                >
                    Delete
                </Button>
            </CardActions>
            <ConfirmationDialog
                title={"Delete Variant"}
                body={"Are you sure you want to delete this variant? This action cannot be undone and will also delete all associated files."}
                onConfirm={deleteVariant}
                onCancel={() => setShowConfirmedDialog(false)} open={showConfirmedDialog}
            />
        </Card>
    );
}


export default VariantCard;
