"use client";
import React, {useEffect, useState} from "react";
import {Box, Button, IconButton, Menu, Stack, Typography,} from "@mui/material";
import {useDispatch} from "react-redux";
import {clearUser} from "@/lib/authSlice/authSlice";
import {useRouter} from "next/navigation";
import {auth} from "@/firebase/firebaseClient";
import {IoPowerOutline} from "react-icons/io5";
import {User} from "@/interfaces";
import {useSnackbar} from "@/contexts/SnackBarContext";

const Profile = () => {
    const [anchorEl2, setAnchorEl2] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const [user, setUser] = useState<null|User>(null);
    const {showNotification} = useSnackbar();

    const handleClick2 = (event: any) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleClose2 = () => {
        setAnchorEl2(null);
    };
    const handleLogout = async () => {
        try {
            await auth.signOut();
            window.localStorage.removeItem("nvrUser");
            dispatch(clearUser());
            router.replace("/");
        } catch (e: any) {
            showNotification(e.message, "error");
            console.error(e)
        }
    }
    useEffect(() => {
        const user = window.localStorage.getItem("nvrUser");
        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);
    return (
        <Box>
            <Stack flexDirection="row" alignItems="center">
                <Typography variant="h6" color="secondary">
                    {user?.username || "User"}
                </Typography>
                <IconButton
                    size="large"
                    aria-label="show 11 new notifications"
                    color="inherit"
                    aria-controls="msgs-menu"
                    aria-haspopup="true"
                    sx={{
                        ...(typeof anchorEl2 === "object" && {
                            color: "primary.main",
                        }),
                    }}
                    onClick={handleClick2}
                >
                    <IoPowerOutline size={30} color={"black"}/>
                </IconButton>
            </Stack>
            {/* ------------------------------------------- */}
            {/* Message Dropdown */}
            {/* ------------------------------------------- */}
            <Menu
                id="msgs-menu"
                anchorEl={anchorEl2}
                keepMounted
                open={Boolean(anchorEl2)}
                onClose={handleClose2}
                anchorOrigin={{horizontal: "right", vertical: "bottom"}}
                transformOrigin={{horizontal: "right", vertical: "top"}}
                sx={{
                    "& .MuiMenu-paper": {
                        width: "100px",
                    },
                }}
            >
                <Box mt={1} py={1} px={2}>
                    <Button
                        onClick={handleLogout}
                        color="primary"
                        variant={"outlined"}
                        fullWidth
                    >
                        Logout
                    </Button>
                </Box>
            </Menu>
        </Box>
    );
};

export default Profile;
