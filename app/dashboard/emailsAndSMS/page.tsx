"use client"
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import {Stack} from "@mui/material";
import PageContainer from "@/app/dashboard/components/container/PageContainer";

import React, {useState} from 'react';
import Header from "@/app/dashboard/emailsAndSMS/components/Header";
import EmailTable from "@/app/dashboard/emailsAndSMS/components/EmailTable";
import SMSForm from "@/app/dashboard/emailsAndSMS/components/SMSSection";

const Page = () => {
    const [formType, setFormType] = useState("email")
    return (
        <PageContainer title="Emails & SMS" description="Manage Emails and SMS">
            <DashboardCard title="Emails & SMS Page">
                <Stack>
                    <Header formType={formType} setFormType={setFormType}/>
                    {formType === "email" && (<EmailTable/>)}
                    {formType === "sms" && (<SMSForm/>)}
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;