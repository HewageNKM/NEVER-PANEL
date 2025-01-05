"use client"
import React from 'react';
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import {Stack} from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";

const Page = () => {
    return (
        <PageContainer title="Expenses" description="Expenses Management">
            <DashboardCard title="Expenses Page">
                <Stack sx={{
                    position: "relative",
                    padding: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3
                }}>
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;