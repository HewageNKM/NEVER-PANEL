'use client';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';
import {Box, Button, Grid, MenuItem, Pagination, Select, Stack} from "@mui/material";
import React, {useEffect} from "react";
import {Error, Item} from "@/interfaces";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {setError} from "@/lib/loadSlice/loadSlice";
import ItemCard from "@/app/dashboard/inventory/components/ItemCard";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import {IoRefresh} from "react-icons/io5";
import EmptyState from "@/app/components/EmptyState";
import Header from "@/app/dashboard/inventory/components/Header";
import {
    getInventoryItems,
    setPage,
    setSelectedItem,
    setShowEditingForm,
    setSize
} from '@/lib/inventorySlice/inventorySlice';
import ItemFormDialog from "@/app/dashboard/inventory/components/ItemFormDialog";


const Page = () => {
    const dispatch = useAppDispatch();
    const {
        items,
        loading,
        selectedType,
        selectedSort,
        size,
        page
    } = useAppSelector(state => state.inventorySlice);
    const {currentUser, loading: authLoading} = useAppSelector(state => state.authSlice);


    const fetchData = async () => {
        try {
            dispatch(getInventoryItems({size, page}))
        } catch (e: any) {
            const error: Error = {
                // @ts-ignore
                id: new Date().getTime(),
                message: e.message,
                severity: "error"
            }
            dispatch(setError(error))
        }
    }

    useEffect(() => {
        if (!authLoading && currentUser) {
            fetchData()
        }
    }, [size, page, currentUser, selectedType, selectedSort, authLoading, dispatch])

    return (
        <PageContainer title="Inventory" description="Products Management">
            <DashboardCard title="Inventory Page">
                <Stack sx={{
                    position: "relative",
                    padding: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3
                }}>
                    <Header/>
                    <Box>
                        {loading ? (<ComponentsLoader/>) : (
                            <Grid container gap={5} mt={2}>
                                {items.map((item: Item) => (
                                    <ItemCard item={item} key={item.itemId} onEdit={() => {
                                        dispatch(setSelectedItem(item))
                                        dispatch(setShowEditingForm(true))
                                    }}/>
                                ))}
                            </Grid>
                        )}
                        {items.length === 0 && <EmptyState title={"Not Items"} subtitle={"Try adding item"}/>}
                    </Box>
                    <Box sx={{
                        position: "absolute",
                        top: -10,
                        left: 0,
                    }}>
                        <Button color={"secondary"} startIcon={<IoRefresh size={25}/>} onClick={() => fetchData()}/>
                    </Box>
                    <Box
                        mt={2}
                        gap={1}
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Select variant="outlined" size="small" defaultValue={size}
                                onChange={(event) => dispatch(setSize(Number.parseInt(event.target.value)))}>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                        <Pagination count={10} variant="outlined" shape="rounded"
                                    onChange={(event, page) => dispatch(setPage(page))}/>
                    </Box>
                    <ItemFormDialog/>
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;
