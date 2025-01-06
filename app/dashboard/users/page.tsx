'use client';
import {Paper, Stack} from '@mui/material';
import PageContainer from '../components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';
import {styled} from '@mui/material/styles';


const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body1,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
}));

const Shadow = () => {
    return (
        <PageContainer title="Users" description="Users Management">

            <DashboardCard title="Users">
                <Stack>

                </Stack>
            </DashboardCard>
        </PageContainer>
    );
};

export default Shadow;
