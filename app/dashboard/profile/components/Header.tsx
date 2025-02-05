import React from 'react';
import {Avatar, Box, Stack, Typography} from "@mui/material";
import {useAppSelector} from "@/lib/hooks";
import {IoLockClosed} from "react-icons/io5";
import Image from "next/image";
import {Banner} from "@/assets/images";

const Header = () => {
    const {currentUser} = useAppSelector(state => state.authSlice);
    return (
        <Stack>
            <Stack
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 2,
                    width: "100%",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <Stack
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        alignItems: "start",
                        width: "100%",
                    }}
                >
                    <Stack
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                            alignItems: "center",
                            justifyContent: "start",
                            bgcolor: "black",
                            width: "100%",
                            borderRadius: 2,
                        }}
                    >
                        <Image
                            src={Banner}
                            alt={"banner"}
                            width={1000}
                            height={250}
                            className="w-full"
                        />
                    </Stack>
                    <Stack
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                            alignItems: "center",
                            justifyContent: "start",
                        }}
                        >
                        <Box>
                            <Avatar sx={
                                {
                                    width: 80,
                                    height: 80,
                                }
                            } variant={"rounded"}>
                                <Typography variant={"h2"}>
                                    {currentUser?.username[0]}
                                </Typography>
                            </Avatar>
                        </Box>
                        <Stack
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography variant={"h3"}>{currentUser?.username}</Typography>
                            <Typography variant="body1">{currentUser?.email}</Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <IoLockClosed size={15}/>
                                <Typography variant="body1" fontWeight={900}>{currentUser?.role}</Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default Header;