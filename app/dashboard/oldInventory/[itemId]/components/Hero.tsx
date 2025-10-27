"use client"
import React from 'react';
import {Box, Breadcrumbs, Link, Skeleton, Stack} from "@mui/material";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import {useRouter} from "next/navigation";
import {useAppSelector} from "@/lib/hooks";

const Hero = () => {
    const {item} = useAppSelector(state => state.itemDetailsSlice);
    const isLoading = !item; // Determine if data is loading
    const router = useRouter();

    const handleBreadcrumbClick = async (href: string) => {
        router.push(href);
    };

    return (
        <Stack
            direction="column" // Responsive layout
            spacing={4} // Space between sections
            alignItems="center"
        >
            {/* Breadcrumbs Section */}
            <Breadcrumbs aria-label="breadcrumb" sx={{width: "100%"}}>
                <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => handleBreadcrumbClick("/dashboard/inventory")}
                    sx={{cursor: "pointer"}}
                >
                    Inventory
                </Link>
                <Typography color="text.primary">
                    {item?.itemId || "Loading..."}
                </Typography>
            </Breadcrumbs>

            <Stack
                direction={{xs: "column", lg: "row"}} // Responsive layout
                spacing={{xs: 4, sm: 6, lg: 12}} // Dynamic spacing for different screen sizes
                alignItems="center"
            >
                {/* Image Section */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "left",
                        width: {xs: "100%", lg: "50%"},
                    }}
                >
                    {isLoading ? (
                        <Skeleton variant="rectangular" width={350} height={350}/>
                    ) : (
                        item?.thumbnail?.url && (
                            <Image
                                src={item.thumbnail.url}
                                alt={item.name || "Thumbnail"}
                                width={350}
                                height={350}
                                style={{borderRadius: 8}}
                            />
                        )
                    )}
                </Box>

                {/* Info Section */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1, // Add consistent spacing
                        width: {xs: "100%", lg: "50%"},
                        textAlign: {xs: "left", md: "center", lg: "left"}, // Center text on small screens
                    }}
                >
                    {isLoading ? (
                        <>
                            <Skeleton variant="text" width="60%" height={24}/>
                            <Skeleton variant="text" width="80%" height={28}/>
                            <Skeleton variant="text" width="70%" height={24}/>
                            <Skeleton variant="text" width="90%" height={28}/>
                            <Skeleton variant="text" width="75%" height={24}/>
                            <Skeleton variant="text" width="85%" height={28}/>
                            <Skeleton variant="text" width="80%" height={24}/>
                            <Skeleton variant="text" width="70%" height={28}/>
                            <Skeleton variant="text" width="65%" height={24}/>
                            <Skeleton variant="text" width="95%" height={28}/>
                        </>
                    ) : (
                        <>
                            <Typography variant="h4" sx={{mb: 1}}>
                                {item?.name}
                            </Typography>
                            <Typography variant="body1">Item ID: {item?.itemId}</Typography>
                            <Typography variant="body1">Brand: {item?.brand}</Typography>
                            <Typography variant="body1">Type: {item?.type}</Typography>
                            <Typography variant="body1">Manufacturer: {item?.manufacturer}</Typography>
                            <Typography variant="body1">Buying Price: {item?.buyingPrice}</Typography>
                            <Typography variant="body1">Selling Price: {item?.sellingPrice}</Typography>
                            <Typography variant="body1">Discount: {item?.discount}%</Typography>
                            <Typography variant="body1">Variants: {item?.variants?.length || 0}</Typography>
                            <Typography variant="body1">Listing: {item?.listing || "Inactive"} </Typography>
                            <Typography variant="body1">Status: {item?.status || "Inactive"}</Typography>
                            <Typography variant="body1">Created At: {item?.createdAt}</Typography>
                            <Typography variant="body1">Updated At: {item?.updatedAt}</Typography>
                        </>
                    )}
                </Box>
            </Stack>

        </Stack>
    );
};

export default Hero;
