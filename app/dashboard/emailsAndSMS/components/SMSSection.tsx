import React, {useState} from 'react';
import {
    Box,
    FormControl, IconButton,
    InputLabel,
    MenuItem, Paper,
    Select,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextareaAutosize,
    TextField,
    Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import {useSnackbar} from "@/contexts/SnackBarContext";
import {sendSMSAction} from "@/actions/emailAndSMSActions";
import {SMS} from "@/interfaces";
import {smsTemplates} from "@/constant";
import {IoPencilSharp, IoRefreshOutline, IoTrash} from "react-icons/io5";
import EmptyState from "@/app/components/EmptyState";
import ComponentsLoader from "@/app/components/ComponentsLoader";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {getSMS} from "@/lib/emailAndSMSSlice/emailSMSSlice";

const SMSSection = () => {
    const {showNotification} = useSnackbar();
    const {sms,smsPage,smsSize,isSMSLoading} = useAppSelector(state => state.emailAndSMSSlice);
    const dispatch = useAppDispatch();
    const [message, setMessage] = useState("")
    const [error, setError] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState(false)

    const onSMSFormSubmit = async (evt) => {
        try {
            setIsLoading(true);
            evt.preventDefault();
            const to = evt.target.to.value.toString().trim();
            const newSms: SMS = {
                to: to,
                text: message,
                sentAt: new Date().toISOString()
            }
            await sendSMSAction(newSms);
            evt.target.reset();
            setMessage("");
            setError(null);
            showNotification("SMS sent successfully", "success");
            dispatch(getSMS({size:smsSize, page:smsPage}));
        } catch (e) {
            console.error(e);
            showNotification(e.message, "error");
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSMS = async () => {
        try {
            dispatch(getSMS({size:smsSize, page:smsPage}));
        }catch (e) {
            console.error(e);
            showNotification(e.message, "error");
        }
    }

    const onMessageChange = (message: string) => {
        if (!/^[^\s][\s\S]{0,149}$/.test(message)) {
            setError("Message should be between 1 and 150 characters.")
        } else {
            setError(null)
        }
        setMessage(message)
    }

    return (
        <Stack
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            alignItems={"flex-start"}
            spacing={2}
            width={"100%"}
        >
            <Box width={"100%"}>
                <Typography variant={"h5"}>Compose SMS</Typography>
                <form onSubmit={onSMSFormSubmit}>

                    <Stack spacing={2} padding={2}>
                        <FormControl>
                            <InputLabel id={"sms-template"}>Template</InputLabel>
                            <Select variant={"outlined"} fullWidth
                                    value={message}
                                    onChange={(evt) => setMessage(evt.target.value)}
                                    id={"sms-template"}
                                    required
                                    defaultValue={message}
                                    label={"Template"}
                            >
                                <MenuItem value={smsTemplates.orderConfirmation}>Order Confirmed</MenuItem>
                                <MenuItem value={smsTemplates.orderShipped}>Order Shipped</MenuItem>
                                <MenuItem value={smsTemplates.orderCancelled}>Order Cancelled</MenuItem>
                                <MenuItem value={smsTemplates.orderStatus}>
                                    Order Status
                                </MenuItem>
                                <MenuItem value={smsTemplates.orderStatusUpdate}>
                                    Order Status Update
                                </MenuItem>
                                <MenuItem value={""}>Empty</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <TextField
                                disabled={isLoading}
                                label={"To"}
                                name={"to"}
                                required
                                id="to-sms"
                                type={"tel"}
                                inputProps={{
                                    title: "Phone number should be 10 digits beginning with 0",
                                    pattern: "[0-9]{10}"
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextareaAutosize
                                disabled={isLoading}
                                value={message}
                                onChange={(evt) => onMessageChange(evt.target.value)}
                                placeholder={"Message"}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    minHeight: "50px"
                                }}
                                minRows={5}
                                id="message"
                                required
                            />
                        </FormControl>
                        {error && <Typography variant={"caption"} fontWeight={800} color={"error"}>{error}</Typography>}
                        <Button disabled={error !== null || isLoading} variant={"contained"} type="submit">Send SMS</Button>
                    </Stack>
                </form>
            </Box>
            <Box
                width={"100%"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                alignItems={"flex-start"}
                gap={2}
            >
                <Typography variant={"h5"}>SMS History</Typography>
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
                                SMS
                            </Typography>
                            <IconButton
                                onClick={fetchSMS}
                                color={"primary"}
                            >
                                <IoRefreshOutline size={25}/>
                            </IconButton>
                        </Box>
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
                                <TableCell>ID</TableCell>
                                <TableCell>TO</TableCell>
                                <TableCell>Message</TableCell>
                                <TableCell>Sent At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sms.map((sms, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{
                                        textTransform: "uppercase"
                                    }}>{sms.id}</TableCell>
                                    <TableCell>{sms.to}</TableCell>
                                    <TableCell>{sms.sentAt}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {(sms.length === 0 && !isSMSLoading) && (
                        <EmptyState
                            title={"No SMS"}
                            subtitle={"No sms available."}
                        />
                    )}
                    {isSMSLoading && (
                        <ComponentsLoader position={"absolute"} title={"Loading sms"}/>
                    )}
                </TableContainer>
            </Box>
        </Stack>
    );
};

export default SMSSection;