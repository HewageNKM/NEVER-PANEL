'use client';
import { Typography } from '@mui/material';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';


const SamplePage = () => {
  return (
    <PageContainer title="Orders" description="Orders Management">
      <DashboardCard title="Order Page">
        <Typography>This is a sample page</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;

