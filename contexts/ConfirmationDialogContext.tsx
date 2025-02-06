import { createContext, useContext, useState, ReactNode } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

type ConfirmationDialogOptions = {
    title?: string;
    message: string;
    onSuccess?: () => void;
    onClose?: () => void;
};

type ConfirmationDialogContextType = {
    showConfirmation: (options: ConfirmationDialogOptions) => void;
};

const ConfirmationDialogContext = createContext<ConfirmationDialogContextType | undefined>(undefined);

export const ConfirmationDialogProvider = ({ children }: { children: ReactNode }) => {
    const [dialog, setDialog] = useState<ConfirmationDialogOptions | null>(null);

    const showConfirmation = (options: ConfirmationDialogOptions) => {
        setDialog(options);
    };

    const handleConfirm = () => {
        dialog?.onSuccess?.();
        setDialog(null);
    };

    const handleClose = () => {
        dialog?.onClose?.();
        setDialog(null);
    };

    return (
        <ConfirmationDialogContext.Provider value={{ showConfirmation }}>
            {children}
            <Dialog open={!!dialog} onClose={handleClose}>
                <DialogTitle>{dialog?.title || "Confirm Action"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialog?.message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary" variant={"contained"} autoFocus>Cancel</Button>
                    <Button onClick={handleConfirm} color="primary" >Confirm</Button>
                </DialogActions>
            </Dialog>
        </ConfirmationDialogContext.Provider>
    );
};

export const useConfirmationDialog = () => {
    const context = useContext(ConfirmationDialogContext);
    if (!context) {
        throw new Error("useConfirmationDialog must be used within a ConfirmationDialogProvider");
    }
    return context;
};