import React from 'react';
import Image from "next/image";
import {Box, Stack, Typography} from "@mui/material";
import Link from "next/link";

const NotFound = () => {
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            height="100vh" // Full viewport height to center vertically
        >
            <Box className="flex flex-col items-center text-center">
                <Box mb={2}> {/* Add margin to space out the elements */}
                    <Image src={"/images/backgrounds/404-error-idea.gif"} height={300} width={300} alt={"404"}/>
                </Box>
                <Typography variant="h1">Page Not Fo
                    und</Typography>
                <Typography variant="subtitle2">Sorry, but the page you were trying to view does not exist.</Typography>
            </Box>
            <Link href={"/"}><Typography variant="body1">Go Back</Typography></Link>
        </Stack>
    );
};

export default NotFound;
