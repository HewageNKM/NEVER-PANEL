"use client"
import React from 'react';
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import {Stack} from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import Header from "@/app/dashboard/websiteSettings/banner/components/Header";
import Form from "@/app/dashboard/websiteSettings/banner/components/Form";

const Page = () => {
    return (
        <PageContainer title="Banners Setting" description="Manage Banners Setting">
            <DashboardCard title="Banners Page">
                <Stack
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Header />
                    <Form />
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;