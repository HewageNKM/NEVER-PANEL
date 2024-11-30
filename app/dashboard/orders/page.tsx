'use client';
import {Stack} from '@mui/material';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';

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
                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Orders;

