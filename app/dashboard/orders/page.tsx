'use client';
import {Stack} from '@mui/material';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';
import OrdersHeader from "@/app/dashboard/orders/components/OrdersHeader";
import OrderTable from "@/app/dashboard/orders/components/OrderTable";

const Orders = () => {
    return (
        <PageContainer title="Orders" description="OrdersTable Management">
            <DashboardCard title="Order Page">
                <Stack sx={{
                    position: "relative",
                    padding: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3
                }}>
                    <OrdersHeader />
                    <OrderTable />
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Orders;

