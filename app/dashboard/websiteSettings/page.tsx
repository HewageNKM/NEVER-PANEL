"use client"
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import {Stack} from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";

import React from 'react';
import SettingCard from "@/app/dashboard/websiteSettings/components/SettingCard";

const Page = () => {
    return (
        <PageContainer title="Website Setting" description="Manage Website Setting">
            <DashboardCard title="Website Setting Page">
                <Stack
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <SettingCard title={"Banners"} link={"/dashboard/websiteSettings/banner"}/>
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;