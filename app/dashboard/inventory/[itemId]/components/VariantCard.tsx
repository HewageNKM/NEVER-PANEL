import React, { useState } from "react";
import { Box, Stack, Typography, Card, CardContent, Button, CardActions } from "@mui/material";
import { Variant } from "@/interfaces";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import ImageSlider from "@/app/dashboard/inventory/[itemId]/components/ImageSlider";
import imageSlider from "@/app/dashboard/inventory/[itemId]/components/ImageSlider";

const VariantCard = ({ variant }: { variant: Variant }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    const handleEdit = () => {
        console.log("Edit clicked for", variant.variantId);
        // Add your edit logic here
    };

    const handleDelete = () => {
        console.log("Delete clicked for", variant.variantId);
        // Add your delete logic here
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
                <ImageSlider images={variant?.images} />
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
                    sx={{ borderTop: "1px solid #e0e0e0", pt: 2 }}
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
                            sx={{ textTransform: "capitalize", mt: 1 }}
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
                    sx={{ textTransform: "capitalize" }}
                >
                    Edit
                </Button>
                <Button
                    size="small"
                    color="error"
                    variant={"contained"}
                    onClick={handleDelete}
                    sx={{ textTransform: "capitalize" }}
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
};

export default VariantCard;
