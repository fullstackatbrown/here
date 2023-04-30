import {
    Alert,
    Snackbar
} from '@mui/material';
import { createContext, useContext, useState } from 'react';

interface SnackbarOptions {
    severity: "success" | "info" | "warning" | "error";
    message: string;
}

interface PromiseInfo {
    resolve: (value: boolean | PromiseLike<boolean>) => void;
    reject: (reason?: any) => void;
}

type ShowSnackbarHandler = (options: SnackbarOptions) => void;

// Create the context so we can use it in our App
const SnackbarContext = createContext<ShowSnackbarHandler>(() => {
    throw new Error('Component is not wrapped with a SnackbarProvider.');
});

const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<SnackbarOptions>();
    const showSnackbar: ShowSnackbarHandler = (options) => {
        // When the dialog is shown, keep the promise info so we can resolve later
        setOptions(options);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                {options &&
                    <Alert onClose={handleClose} severity={options.severity} sx={{ width: '100%' }}>
                        {options.message}
                    </Alert>
                }
            </Snackbar>
            <SnackbarContext.Provider value={showSnackbar}>
                {children}
            </SnackbarContext.Provider>
        </>
    );
};

export const useSnackbar = () => {
    return useContext(SnackbarContext);
};

export default SnackbarProvider;