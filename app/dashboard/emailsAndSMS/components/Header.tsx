import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';

const Header = ({formType, setFormType}:{
    formType: string;
    setFormType:any
}) => {
    const handleChange = (
        event: React.SyntheticEvent<Element, Event>,
        newValue: string
    ) => {
        setFormType(newValue);
    };

    return (
        <Tabs
            value={formType}
            onChange={handleChange}
            centered
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 2 }}
        >
            <Tab label="Email" value="email" sx={{ width: 300 }} />
            <Tab label="SMS" value="sms" sx={{ width: 300 }} />
        </Tabs>
    );
};

export default Header;