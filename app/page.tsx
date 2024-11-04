"use client";
import {Box, Card, Grid, Stack, Typography,} from "@mui/material";
// components
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import Logo from "@/app/dashboard/layout/shared/logo/Logo";
import AuthLogin from "./components/AuthLogin";
import {authenticateUser} from "@/actions/authAction";
import {useAppDispatch} from "@/lib/hooks";
import {setError, setLoading} from "@/lib/loadSlice/loadSlice";
import {useRouter} from "next/navigation";

const Login = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const onFormSubmit = async (evt: any) => {
        evt.preventDefault();
        dispatch(setLoading(true));
        try {
            const email: string = evt.target.email.value;
            const password: string = evt.target.password.value;
            const credential = await authenticateUser(email, password);

            console.log(credential);
            router.replace("/dashboard");
        } catch (e: any) {
            dispatch(setError({
                id: new Date().getTime(),
                message: "Invalid email or password",
                severity: "error"
            }))
            console.log(e);
        } finally {
            dispatch(setLoading(false)); // Hide loading indicator after authentication attempt
        }
    };


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
            </Box>
        </PageContainer>
    );
};

export default Login;
