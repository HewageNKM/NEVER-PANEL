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
import {IoAdd, IoRefreshOutline, IoTrash} from "react-icons/io5";
import EmptyState from "@/app/components/EmptyState";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {getEmails, setPage, setSize} from '@/lib/emailAndSMSSlice/emailSMSSlice';
import {useSnackbar} from "@/contexts/SnackBarContext";
import {RefreshOutlined} from "@mui/icons-material";

const EmailTable = () => {
    const dispatch = useAppDispatch();
    const {emails, page, isLoading, size} = useAppSelector(state => state.emailAndSMSSlice);
    const {currentUser} = useAppSelector(state => state.authSlice);
    const {showNotification} = useSnackbar();

    const fetchEmails = async () => {
        try {
            dispatch(getEmails({size, page}));
        } catch (e) {
            console.error(e);
            showNotification(e.message, "error");
        }
    }
    useEffect(() => {
        if (currentUser) {
            fetchEmails();
        }
    }, [currentUser, page, size]);

    return (
        <Stack direction={"column"} gap={5} mt={2}>
            <TableContainer component={Paper} sx={{
                position: "relative",
                borderRadius: 2,
                boxShadow: 2,
                overflow: "hidden"
            }}>
                <Box flexDirection={"row"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                    <Box
                        flexDirection={"row"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <Typography variant="h6" component="div" sx={{pl: 2, py: 2}}>
                            Emails
                        </Typography>
                        <IconButton
                            onClick={fetchEmails}
                            color={"primary"}
                        >
                            <IoRefreshOutline size={25}/>
                        </IconButton>
                    </Box>
                    <IconButton
                        color={"primary"}
                    >
                        <IoAdd size={25}/>
                    </IconButton>
                </Box>
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
                            <TableCell>To</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {emails.map((email, index) => (
                            <TableRow key={index}>
                                <TableCell>{email.to}</TableCell>
                                <TableCell>{email?.message?.subject || email?.template?.name}}</TableCell>
                                <TableCell>{email.status}</TableCell>
                                <TableCell>{email.time}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color={"error"}
                                    >
                                        <IoTrash size={25}/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {(emails.length === 0 && !isLoading) && (
                    <EmptyState
                        title={"No emails"}
                        subtitle={"No emails available."}
                    />
                )}
                {isLoading && (
                    <ComponentsLoader position={"absolute"} title={"Loading Emails"}/>
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
                <Select variant="outlined" size="small" defaultValue={size}
                        onChange={(event) => dispatch(setSize(Number.parseInt(event.target.value)))}>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>
                <Pagination count={10} variant="outlined" shape="rounded"
                            onChange={(event, page) => dispatch(setPage(page))}/>
            </Box>
        </Stack>
    );
};

export default EmailTable;