import React, {useState} from 'react';
import {useAppSelector} from "@/lib/hooks";
import {Box, Button, FormControl, IconButton, InputAdornment, Stack, TextField} from "@mui/material";
import {IoEye, IoEyeOff} from "react-icons/io5";

const PasswordForm = () => {
    const {currentUser} = useAppSelector(state => state.authSlice);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);


    const onUpdate = async (evt) => {
        try {
            evt.preventDefault();
            console.log("Updating password");
        } catch (e) {
            console.log(e);
        }
    }
    const setPasswordResetLink = async () => {
        try {
            console.log("Setting password reset link");
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <Stack
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: 2,
            }}
        >
            <form onSubmit={onUpdate}>
                <Stack
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}
                >
                    {[
                        {label: "Current Password", show: showCurrentPassword, setShow: setShowCurrentPassword},
                        {label: "New Password", show: showNewPassword, setShow: setShowNewPassword},
                        {label: "Confirm Password", show: showConfirmPassword, setShow: setShowConfirmPassword},
                    ].map(({label, show, setShow}, index) => (
                        <FormControl key={index} sx={{width: "100%", maxWidth: 300}}>
                            <TextField
                                required
                                type={show ? "text" : "password"}
                                label={label}
                                variant="outlined"
                                fullWidth
                                inputProps={{
                                    pattern: "^\\S{8,}$",
                                    title: "8 characters minimum no spaces"
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShow(!show)} edge="end">
                                                {show ? <IoEye/> : <IoEyeOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                    ))}

                    <Button type="submit" color="primary" variant="contained">
                        Update
                    </Button>
                </Stack>
            </form>
            <Box>
                <Button onClick={() => setPasswordResetLink}>
                    Or reset by link?
                </Button>
            </Box>
        </Stack>
    );
};

export default PasswordForm;