"use client"
import React, {useEffect, useState} from 'react';
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import {Stack} from "@mui/material";
import Hero from "@/app/dashboard/inventory/[itemId]/components/Hero";
import Variants from "@/app/dashboard/inventory/[itemId]/components/Variants";
import {useParams} from "next/navigation";
import {useAppSelector} from "@/lib/hooks";
import {fetchAItem} from "@/actions/inventoryActions";

const Page = () => {
    const {currentUser, loading: authLoading} = useAppSelector(state => state.authSlice);
    const [item, setItem] = useState(null)
    const params = useParams();
    const {itemId} = params;

    useEffect(() => {
        if (currentUser && !authLoading) {
            fetchAItem(itemId).then((item) => {
                setItem(item)
            }).catch((e) => {
                console.error(e)
            })
        }
    }, [itemId, currentUser]);
    return (
        <PageContainer title="Inventory" description="Products Management">
            <DashboardCard title={`Item Details Page - ${itemId.toUpperCase()}`}>
                <Stack sx={{
                    display:"flex",
                    flexDirection:"column",
                    gap:3
                }}>
                    <Hero item={item}/>
                    <Variants item={item}/>
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;