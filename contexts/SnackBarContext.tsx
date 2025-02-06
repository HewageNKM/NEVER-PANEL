import { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type SnackbarContextType = {
    showNotification: (message: string, severity?: "success" | "error" | "warning" | "info") => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const showNotification = (message: string, severity: "success" | "error" | "warning" | "info" = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return; // Prevent closing on clickaway
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <SnackbarContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                action={
                    <IconButton size="small" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <Alert severity={snackbar.severity as any} onClose={handleClose}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within a SnackbarProvider");
    }
    return context;
};
