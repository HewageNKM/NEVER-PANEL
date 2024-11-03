"use client"
import React, {ReactNode} from 'react';
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {Alert, AlertTitle, Box, CircularProgress, Stack} from "@mui/material";
import {Error} from "@/interfaces";
import {hideError} from "@/lib/loadSlice/loadSlice";


const GlobalProvider = ({children}: { children: ReactNode }) => {
    const isLoading = useAppSelector(state => state.loadSlice.isLoaded)
    const dispatch = useAppDispatch();
    const errors = useAppSelector(state => state.loadSlice.errors)

    return (
        <>
            {children}
            {isLoading && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        backdropFilter: "blur(5px)",
                        zIndex: 1200,
                    }}
                >
                    <CircularProgress size="3rem"/>
                </Box>
            )}
            {errors && (
                <Stack sx={{
                    position: "fixed",
                    top: 16,
                    display: "flex",
                    direction: "column",
                    gap: 2,
                    right: 12,
                    zIndex: 1300,
                }}>
                    {errors.map((error: Error) => (
                        <Alert severity={error.severity} key={error.id} onClose={()=>{
                            dispatch(hideError(error.id))
                        }}>
                            <AlertTitle>Error</AlertTitle>
                            {error.message}
                        </Alert>
                    ))}
                </Stack>
            )}
        </>
    );
};

export default GlobalProvider;
