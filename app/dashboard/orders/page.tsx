'use client';
import {Stack, Typography} from '@mui/material';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';
import Header from "@/app/dashboard/orders/components/Header";
import Orders from "@/app/dashboard/orders/components/Orders";


const SamplePage = () => {
  return (
    <PageContainer title="Orders" description="Orders Management">
      <DashboardCard title="Order Page">
          <Stack>
              <Header />
              <Orders />
          </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;

