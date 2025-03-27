"use client"
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import {Stack} from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";

import React, {useState} from 'react';
import Header from "@/app/dashboard/website/components/Header";
import Banner from "@/app/dashboard/website/banner/Banner";
import Dashboard from "@/app/dashboard/website/dashboard/Dashboard";
import Collections from "@/app/dashboard/website/collections/Collections";
import NavMenu from "@/app/dashboard/website/navMenu/NavMenu";

const Page = () => {
    const [formType, setFormType] = useState("dashboard")
    return (
        <PageContainer title="Website" description="Manage Website">
            <DashboardCard title="Website">
                <Stack>
                    <Header formType={formType} setFormType={setFormType}/>
                    {formType === "dashboard" && (<Dashboard />)}
                    {formType === "banner" && (<Banner />)}
                    {formType === "collections" && (<Collections />)}
                    {formType === "navMenu" && (<NavMenu />)}
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;