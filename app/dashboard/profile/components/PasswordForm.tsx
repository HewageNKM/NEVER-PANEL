import React, {useState} from 'react';
import {useAppSelector} from "@/lib/hooks";
import {Box, Button, FormControl, IconButton, InputAdornment, Stack, TextField} from "@mui/material";
import {IoEye, IoEyeOff} from "react-icons/io5";
import {User} from "@/model";
import {updateUserByIdAction} from "@/actions/usersActions";
import {sendPasswordResetEmail} from "@firebase/auth";
import {auth} from "@/firebase/firebaseClient";
import {useSnackbar} from "@/contexts/SnackBarContext";
import {useConfirmationDialog} from "@/contexts/ConfirmationDialogContext";

const PasswordForm = () => {
    const {currentUser} = useAppSelector(state => state.authSlice);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const {showNotification} = useSnackbar();
    const {showConfirmation} = useConfirmationDialog();

    const onUpdate = async (evt) => {
        evt.preventDefault();
        setIsLoading(true);
        showConfirmation({
            title: "Update Password",
            message: "This action take an immediate effect. Are you sure you want to update your password?",
            onSuccess: async () => {
                try {
                    const currentPassword = evt.target.currentPassword.value.toString();
                    const newPassword = evt.target.newPassword.value.toString();
                    const confirmPassword = evt.target.confirmedPassword.value.toString();

                    if (newPassword !== confirmPassword) {
                        showNotification("Passwords do not match", "warning");
                        return;
                    }

                    const newUser: User = {
                        ...currentUser,
                        password: newPassword,
                        currentPassword,
                        updatedAt: new Date().toISOString(),
                    }
                    await updateUserByIdAction(newUser);
                    evt.target.reset();
                    showNotification("Password updated successfully", "success");
                } catch (e) {
                    console.log(e);
                    showNotification(e.message, "error");
                } finally {
                    setIsLoading(false);
                }
            },
            onClose: () => {
            }
        })
    }
    const sentPasswordResetLink = async () => {
        try {
            showConfirmation({
                title: "Reset Password",
                message: "Are you sure you want to reset your password? A reset link will be sent to your email.",
                onSuccess: async () => {
                    try {
                        if (currentUser?.email) await sendPasswordResetEmail(auth, currentUser?.email);
                        showNotification("Password reset link sent successfully", "success");
                    } catch (e) {
                        console.log(e);
                        showNotification(e.message, "error");
                    }
                },
                onClose: () => {
                }
            })
        } catch (e) {
            console.log(e);
            showNotification(e.message, "error");
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
                        {
                            label: "Current Password",
                            show: showCurrentPassword,
                            setShow: setShowCurrentPassword,
                            name: "currentPassword"
                        },
                        {
                            label: "New Password",
                            show: showNewPassword,
                            setShow: setShowNewPassword,
                            name: "newPassword"
                        },
                        {
                            label: "Confirm Password",
                            show: showConfirmPassword,
                            setShow: setShowConfirmPassword,
                            name: "confirmedPassword"
                        },
                    ].map(({label, show, setShow, name}, index) => (
                        <FormControl key={index} sx={{width: "100%", maxWidth: 300}}>
                            <TextField
                                disabled={isLoading}
                                required
                                type={show ? "text" : "password"}
                                label={label}
                                name={name}
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
                <Button onClick={() => sentPasswordResetLink()}>
                    Or reset by link?
                </Button>
            </Box>
        </Stack>
    );
};

export default PasswordForm;