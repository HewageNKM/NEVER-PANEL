"use client"
import React from 'react';
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import {Stack} from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import Header from "@/app/dashboard/expenses/components/Header";
import ExpensesTable from "@/app/dashboard/expenses/components/ExpensesTable";

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
                    <Header />
                    <ExpensesTable />
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;