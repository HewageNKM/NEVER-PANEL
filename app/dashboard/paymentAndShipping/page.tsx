"use client"
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import {Stack} from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";

import React from 'react';
import Header from "@/app/dashboard/paymentAndShipping/components/Header";

const Page = () => {
    return (
        <PageContainer title="Payment & Shipping" description="Manage Payments and Shipping Method">
            <DashboardCard title="Payment & Shipping Page">
                <Stack
                    sx={{
                        position: "relative",
                        padding: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3
                    }}
                >
                    <Header/>
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;