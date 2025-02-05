"use client"
import React, {useState} from "react";
import {Box, Button, IconButton, InputAdornment, Stack, Typography,} from "@mui/material";
import Link from "next/link";

import CustomTextField from "@/app/dashboard/components/forms/theme-elements/CustomTextField";
import {IoEye, IoEyeOff} from "react-icons/io5";


const AuthLogin = ({title, subtitle, subtext, onFormSubmit}: {
    title?: any,
    subtitle: any,
    onFormSubmit: any,
    subtext: any
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (<>
        {title ? (
            <Typography fontWeight="700" variant="h2" mb={1}>
                {title}
            </Typography>
        ) : null}

        {subtext}
        <form onSubmit={(evt) => onFormSubmit(evt)}>
            <Stack>
                <Box>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="username"
                        mb="5px"
                    >
                        Email
                    </Typography>
                    <CustomTextField name={"email"} required type={"email"} variant="outlined" fullWidth/>
                </Box>
                <Box mt="25px">
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="password"
                        mb="5px"
                    >
                        Password
                    </Typography>
                    <CustomTextField name={"password"} required type={showPassword ? "text" : "password"}
                                     variant="outlined" fullWidth
                                     InputProps={{
                                         endAdornment: (
                                             <InputAdornment position="end">
                                                 <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                     {showPassword ? <IoEye/> : <IoEyeOff/>}
                                                 </IconButton>
                                             </InputAdornment>
                                         ),
                                     }}
                                     inputProps={{pattern: "^\\S{8,}$", title: "8 characters minimum no spaces"}}
                    />
                </Box>
                <Stack
                    justifyContent="space-between"
                    direction="row"
                    alignItems="center"
                    my={2}
                >
                    <Typography
                        component={Link}
                        href="/reset-password"
                        fontWeight="500"
                        sx={{
                            textDecoration: "none",
                            color: "primary.main",
                        }}
                    >
                        Reset Password ?
                    </Typography>
                </Stack>
            </Stack>
            <Box>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                >
                    Sign In
                </Button>
            </Box>
            {subtitle}
        </form>
    </>);
}

export default AuthLogin;
