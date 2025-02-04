"use client";
import React, {useEffect} from 'react';
import {
    Box,
    IconButton,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {IoPencil, IoTrash} from "react-icons/io5";
import EmptyState from "@/app/components/EmptyState";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {User} from "@/interfaces";
import {getAllUsers, setSelectedPage, setSelectedSize, setSelectedUser} from '@/lib/usersSlice/usersSlice';

const UserTable = () => {
    const {users, loading, selectedPage, selectedSize,selectedRole,selectedStatus} = useAppSelector(state => state.usersSlice);
    const {currentUser} = useAppSelector(state => state.authSlice);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (currentUser) {
            dispatch(getAllUsers({size: selectedSize, page: selectedPage}));
        }
    }, [currentUser, selectedSize, selectedPage,selectedRole,selectedStatus]);

    return (
        <Stack direction={"column"} gap={5}>
            <TableContainer component={Paper} sx={{
                position: "relative",
                borderRadius: 2,
                boxShadow: 2,
                overflow: "hidden"
            }}>
                <Typography variant="h6" component="div" sx={{padding: 2}}>
                    Orders
                </Typography>
                <Table
                    sx={{
                        minWidth: 650,
                        "& thead": {
                            backgroundColor: "#f5f5f5",
                            "& th": {
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                fontSize: "0.875rem"
                            }
                        },
                        "& tbody tr:nth-of-type(odd)": {
                            backgroundColor: "#fafafa"
                        },
                        "& tbody tr:hover": {
                            backgroundColor: "#f0f0f0"
                        }
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>User ID</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Updated At</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user: User) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.status}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.createdAt}</TableCell>
                                <TableCell>{user.updatedAt}</TableCell>
                                <TableCell>
                                    <Box flexDirection={"row"} display={"flex"} gap={1}>
                                        <IconButton onClick={() => dispatch(setSelectedUser(user))}
                                        color={"primary"}
                                        >
                                            <IoPencil size={25}/>
                                        </IconButton>
                                        <IconButton color={"error"}>
                                            <IoTrash size={25}/>
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {(users.length === 0 && !loading) && (
                    <EmptyState
                        title={"No users"}
                        subtitle={"No users available."}
                    />
                )}
                {loading && (
                    <ComponentsLoader position={"absolute"} title={"Loading Users"}/>
                )}
            </TableContainer>
            <Box
                mt={2}
                gap={1}
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
            >
                <Select variant="outlined" size="small" defaultValue={selectedSize}
                        onChange={(event) => dispatch(setSelectedSize(Number.parseInt(event.target.value)))}>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>
                <Pagination count={10} variant="outlined" shape="rounded"
                            onChange={(event, page) => dispatch(setSelectedPage(page))}/>
            </Box>
        </Stack>
    );
};

export default UserTable;