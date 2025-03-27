"use client"
import React from 'react';
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import {Stack} from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import Header from "@/app/dashboard/reports/components/Header";

const Banner = () => {
    return (
        <PageContainer title="Reports" description="Reports Management">
            <DashboardCard title="Reports Banner">
                <Stack sx={{
                    position: "relative",
                    padding: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3
                }}>
                    <Header />
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;