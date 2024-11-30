'use client';
import {Stack} from '@mui/material';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';
import Header from "@/app/dashboard/orders/components/Header";
import OrdersTable from "@/app/dashboard/orders/components/OrdersTable";


const Orders = () => {
    return (
        <PageContainer title="Orders" description="OrdersTable Management">
            <DashboardCard title="Order Page">
                <Stack>
                    <Header/>
                    <OrdersTable/>
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Orders;

