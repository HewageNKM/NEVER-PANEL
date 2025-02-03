import React, {useState} from "react";
import {Avatar, Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem,} from "@mui/material";

import {IconUser} from "@tabler/icons-react";
import {useDispatch} from "react-redux";
import {clearUser} from "@/lib/authSlice/authSlice";
import {useRouter} from "next/navigation";
import {auth} from "@/firebase/firebaseClient";
import {IoPowerOutline} from "react-icons/io5";

const Profile = () => {
    const [anchorEl2, setAnchorEl2] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();

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
            console.error(e)
        }
    }
    return (
        <Box>
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
                        width: "200px",
                    },
                }}
            >
                <Box mt={1} py={1} px={2}>
                    <Button
                        onClick={handleLogout}
                        color="primary"
                        fullWidth
                    >
                        Proceed to Logout
                    </Button>
                </Box>
            </Menu>
        </Box>
    );
};

export default Profile;
