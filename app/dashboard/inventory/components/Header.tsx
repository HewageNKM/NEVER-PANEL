import React from 'react';
import {Box, Button, MenuItem, Select, TextField, Typography} from "@mui/material";
import {IoAdd, IoSearch} from "react-icons/io5";
import {sortInventoryOptions, types} from "@/constant";
import {useAppDispatch} from "@/lib/hooks";
import {
    setSelectedItem,
    setSelectedSort,
    setSelectedType,
    setShowEditingForm
} from "@/lib/inventorySlice/inventorySlice";
import AddIcon from "@mui/icons-material/Add";

const Header = () => {
    const dispatch = useAppDispatch();

    const showAddForm = () => {
        dispatch(setSelectedItem(null))
        dispatch(setShowEditingForm(true))
    }
    return (
        <Box display="flex" flexDirection="column" flexWrap={"wrap"} gap={2} padding={1} mt={2}>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                flexWrap={"wrap"}
            >
                <Box display={"flex"} flexDirection={"row"} gap={1}>
                    <TextField size={"small"} variant={"outlined"} label={"Search"}/>
                    <Button startIcon={<IoSearch/>}/>
                </Box>
                <Box display="flex" flexWrap={"wrap"} flexDirection="row" gap={2} justifyItems={"start"}
                     alignItems="start">
                    <Box display="flex" flexDirection="column" alignItems="start" gap={1}>
                        <Typography variant="body1" color="textSecondary">Type:</Typography>
                        <Select variant="outlined" size="small" defaultValue="all"
                                onChange={(evt) => dispatch(setSelectedType(evt.target.value))}>
                            <MenuItem value={"all"} key="all">All</MenuItem>
                            {types.map((option) => (
                                <MenuItem value={option.value} key={option.value}>{option.name}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                    <Box display="flex" flexDirection="column" alignItems="start" gap={1}>
                        <Typography variant="body1" color="textSecondary">Sort by:</Typography>
                        <Select variant="outlined" size="small" defaultValue="none"
                                onChange={(evt) => dispatch(setSelectedSort(evt.target.value))}>
                            {sortInventoryOptions.map((option) => (
                                <MenuItem value={option.value} key={option.value}>{option.name}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                    <Box display="flex" justifyContent={"center"} mt={3.6}>
                        <Button
                            onClick={() => showAddForm()}
                            type={"button"}
                            variant="contained"
                            startIcon={<AddIcon/>} // Add the icon here
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )

};

export default Header;
