"use client";

import {Box, Grid} from "@mui/material";
import PageContainer from "./components/container/PageContainer";
// components
import SalesOverview from "./components/dashboard/SalesOverview";
import RecentTransactions from "./components/dashboard/RecentTransactions";
import Blog from "./components/dashboard/Blog";
import DailyEarnings from "./components/dashboard/DailyEarnings";

const Dashboard = () => {
    return (
        <PageContainer title="Dashboard" description="This is the Dashboard">
            <Box>
                <Grid container spacing={3}>
                    {/* Sales Overview Section */}
                    <Grid item xs={12} md={8}>
                        <SalesOverview/>
                    </Grid>

                    {/* Daily Earnings and Recent Transactions */}
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <DailyEarnings/>
                            </Grid>
                            <Grid item xs={12}>
                                <RecentTransactions/>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Blog Section */}
                    <Grid item xs={12}>
                        <Blog/>
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
};
export const dynamic = 'force-dynamic';
export default Dashboard;
