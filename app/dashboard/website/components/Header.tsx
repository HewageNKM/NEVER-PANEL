import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';

const Header = ({formType, setFormType}: {
    formType: string;
    setFormType: any
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
            sx={{mb: 2}}
        >
            <Tab label="Dashboard" value="dashboard" sx={{width: 200}}/>
            <Tab label="Banner" value="banner" sx={{width: 200}}/>
            <Tab label="Collections" value="collections" sx={{width: 200}}/>
            <Tab label="Nav Menu" value="navMenu" sx={{width: 200}}/>
        </Tabs>
    );
};

export default Header;