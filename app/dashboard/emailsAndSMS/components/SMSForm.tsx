import React, {useState} from 'react';
import {FormControl, InputLabel, MenuItem, Select, Stack, TextareaAutosize, TextField, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {useSnackbar} from "@/contexts/SnackBarContext";
import {sendSMSAction} from "@/actions/emailAndSMSActions";
import {SMS} from "@/interfaces";
import {smsTemplates} from "@/constant";

const SmsForm = () => {
    const {showNotification} = useSnackbar();
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
                text: message
            }
            await sendSMSAction(newSms);
            evt.target.reset();
            setMessage("");
            setError(null);
            showNotification("SMS sent successfully", "success");
        } catch (e) {
            console.error(e);
            showNotification(e.message, "error");
        } finally {
            setIsLoading(false)
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
            spacing={2}
        >
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
        </Stack>
    );
};

export default SmsForm;