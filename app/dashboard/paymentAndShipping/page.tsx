"use client"
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import {Stack} from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";

import React from 'react';

const Page = () => {
    return (
        <PageContainer title="Payment & Shipping" description="Manage Payments and Shipping Method">
            <DashboardCard title="Payment & Shipping Page">
                <Stack>
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;