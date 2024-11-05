'use client';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';
import {Box, Button, Grid, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import {fetchInventory} from "@/actions/inventoryActions";
import {Error, Item} from "@/interfaces";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {setError} from "@/lib/loadSlice/loadSlice";
import ItemCard from "@/app/dashboard/inventory/components/ItemCard";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import {IoRefresh} from "react-icons/io5";
import EmptyState from "@/app/components/EmptyState";


const Page = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([] as Item[])
    const dispatch = useAppDispatch();

    const [selectedItem,setSelectedItem] = useState(null)

    const {currentUser,loading:authLoading} = useAppSelector(state => state.authSlice);


    const [size, setSize] = useState(20)
    const [page, setPage] = useState(1)


    const fetchData = async () => {
        setLoading(true)
        try {
            const res: Item[] = await fetchInventory(size, page);
            setData(res)
        } catch (e: any) {
            const error: Error = {
                // @ts-ignore
                id: new Date().getTime(),
                message: e.message,
                severity: "error"
            }
            dispatch(setError(error))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(!authLoading && currentUser){
            fetchData()
        }
    }, [size, page, currentUser])

    return (
        <PageContainer title="Inventoary" description="Products Management">
            <DashboardCard title="Inventoary Page">
                <Stack sx={{
                    position: "relative",
                    padding: 3
                }}>
                    <Box flexDirection="column" columnGap={10}>
                    </Box>
                    <Box>
                        {loading ? (<ComponentsLoader/>) : (
                            <Grid container gap={5} mt={5}>
                            {data.map((item: Item) => (
                                <ItemCard item={item} key={item.itemId}/>
                            ))}
                            </Grid>
                        )}
                        {data.length === 0 && <EmptyState title={"Not Items"} subtitle={"Add Items"}/>}
                    </Box>
                    <Box sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}>
                        <Button color={"secondary"} startIcon={<IoRefresh size={25}/>} onClick={() => fetchData()}/>
                    </Box>
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Page;
