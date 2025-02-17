import React from 'react';
import { PopularItem } from "@/interfaces";
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box } from "@mui/material";

const PopularItemCard = ({ item }: { item: PopularItem }) => {
    return (
        <Card
            sx={{
                maxWidth: 130,
                minWidth: 130,
                borderRadius: 2,
                boxShadow: 2,
                transition: "0.3s",
                "&:hover": {
                    boxShadow: 5,
                    transform: "scale(1.05)",
                }
            }}
        >
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={item.item.thumbnail.url}
                    alt={item.item.name}
                    sx={{ borderRadius: "8px 8px 0 0" }}
                />
                <CardContent sx={{ p: 1.5, textAlign: "center" }}>
                    <Typography
                        variant="subtitle1"
                        noWrap
                        sx={{ fontWeight: 600, fontSize: "0.9rem", color: "primary.main" }}
                    >
                        {item.item.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontSize: "0.8rem", mt: 0.5 }}
                    >
                        LKR {Math.round(item.item.sellingPrice - (item.item.sellingPrice * item.item.discount / 100)).toFixed(2)}
                    </Typography>
                    <Box
                        sx={{
                            background: "#F5F5F5",
                            borderRadius: 1,
                            fontWeight: 600,
                            display: "inline-block",
                            px: 1,
                            py: 0.3,
                            fontSize: "0.75rem",
                            mt: 0.8
                        }}
                    >
                        Sold: {item.soldCount}
                    </Box>
                </CardContent>
                <Box
                    sx={{
                        backgroundColor: "primary.main",
                        borderRadius: "0 0 8px 8px",
                        p: .8,
                        mt: -1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            textTransform: "capitalize",
                            color: "white",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            mt: 0.5,
                            textAlign: "center",
                        }}
                    >
                        {item.item.manufacturer}
                    </Typography>
                </Box>
            </CardActionArea>
        </Card>
    );
};

export default PopularItemCard;
