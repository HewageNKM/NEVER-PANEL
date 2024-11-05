import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const ConfirmationDialog = ({title,body,onConfirm, onCancel,open}:{
    title:string,
    body:string,
    onConfirm:any,
    onCancel:any,
    open:boolean
}) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {body}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant={"contained"} color={"primary"} autoFocus onClick={onCancel}>Disagree</Button>
                <Button variant={"contained"} color={"error"} onClick={onConfirm} >
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;