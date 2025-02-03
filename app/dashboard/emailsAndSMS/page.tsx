"use client"
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import {Stack} from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";

import React from 'react';

const Page = () => {
    return (
        <PageContainer title="Emails & SMS" description="Manage Emails and SMS">
            <DashboardCard title="Emails & SMS Page">
                <Stack>
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;