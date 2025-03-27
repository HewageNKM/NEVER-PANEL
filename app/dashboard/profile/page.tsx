"use client";
import React from 'react';
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import {Stack} from "@mui/material";
import Header from '../profile/components/Header';
import PasswordForm from './components/PasswordForm';

const Page = () => {
    return (
        <PageContainer title="Profile" description="Manage user profile">
            <DashboardCard title="Profile Page">
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
                    <PasswordForm/>
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;