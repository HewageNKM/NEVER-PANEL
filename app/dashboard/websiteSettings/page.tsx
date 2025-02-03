"use client"
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import {Stack} from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";

import React from 'react';

const Page = () => {
    return (
        <PageContainer title="Website Setting" description="Manage Website Setting">
            <DashboardCard title="Website Setting Page">
                <Stack>
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;