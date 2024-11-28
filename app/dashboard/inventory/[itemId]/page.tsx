"use client"
import React, {useEffect} from 'react';
import DashboardCard from "@/app/dashboard/components/shared/DashboardCard";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import {Stack} from "@mui/material";
import Hero from "@/app/dashboard/inventory/[itemId]/components/Hero";
import Variants from "@/app/dashboard/inventory/[itemId]/components/Variants";
import {useParams} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {fetchAItem} from "@/actions/inventoryActions";
import VariantFormDialog from "@/app/dashboard/inventory/[itemId]/components/VariantFormDialog";
import {setItem} from "@/lib/itemDetailsSlice/itemDetailsSlice";

const Page = () => {
    const {currentUser, loading: authLoading} = useAppSelector(state => state.authSlice);
    const dispatch = useAppDispatch();

    const params = useParams();
    const {itemId} = params;

    useEffect(() => {
        if (currentUser && !authLoading) {
            fetchAItem(itemId).then((item) => {
                setItem(item)
                dispatch(setItem(item))
            }).catch((e) => {
                console.error(e)
            })
        }
    }, [itemId, currentUser]);


    return (
        <PageContainer title="Inventory" description="Products Management">
            <DashboardCard title={`Item Details - ${itemId.toUpperCase()}`}>
                <Stack sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3
                }}>
                    <Hero/>
                    <Variants/>
                    <VariantFormDialog
                        onClose={() => {
                        }}
                        onSave={() => {
                        }}/>
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;