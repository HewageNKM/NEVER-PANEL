"use client";
import {Box, Card, Grid, Stack, Typography,} from "@mui/material";
// components
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import Logo from "@/app/dashboard/layout/shared/logo/Logo";
import AuthLogin from "./components/AuthLogin";
import {authenticateUser} from "@/actions/authAction";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {useRouter} from "next/navigation";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import {setUser} from "@/lib/authSlice/authSlice";
import {useEffect} from "react";
import {User} from "@/interfaces";
import {setLoading} from "@/lib/authSlice/authSlice";

const Login = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {loading, currentUser} = useAppSelector(state => state.authSlice);

    const onFormSubmit = async (evt: any) => {
        evt.preventDefault();
       dispatch(setLoading(true));
        try {
            const email: string = evt.target.email.value;
            const password: string = evt.target.password.value;
            const user:User = await authenticateUser(email, password);
            if (user.role === "ADMIN"){
                dispatch(setUser(user))
                router.replace("/dashboard");
            }else {
                alert("You are not authorized to access this page")
            }
        } catch (e: any) {
            console.log(e);
        }finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (currentUser) {
            router.replace("/dashboard")
        }
    }, [currentUser]);

    return (
        <PageContainer title="Login" description="this is Login page">
            <Box
                sx={{
                    position: "relative",
                    "&:before": {
                        content: '""',
                        background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
                        backgroundSize: "400% 400%",
                        animation: "gradient 15s ease infinite",
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        opacity: "0.3",
                    },
                }}
            >
                <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    sx={{height: "100vh"}}
                >
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        lg={4}
                        xl={3}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Card
                            elevation={9}
                            sx={{p: 4, zIndex: 1, width: "100%", maxWidth: "500px"}}
                        >
                            <Box display="flex" alignItems="center" mb={2} justifyContent="center">
                                <Logo/>
                            </Box>
                            <AuthLogin
                                onFormSubmit={onFormSubmit}
                                subtext={
                                    <Typography
                                        variant="subtitle1"
                                        textAlign="center"
                                        color="textSecondary"
                                        mb={1}
                                    >
                                        NEVER PANEL 2.0
                                    </Typography>
                                }
                                subtitle={
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        justifyContent="center"
                                        mt={3}
                                    />
                                }
                            />
                        </Card>
                    </Grid>
                </Grid>
                {loading && <ComponentsLoader title="Loading User" position={"fixed"}/>}
            </Box>
        </PageContainer>
    );
};

export default Login;
