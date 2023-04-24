import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { createContext, useContext, useState } from 'react';

// reference: https://blog.perfect-base.com/react-dialog-snackbar

interface DialogOptions {
    title?: string;
    message?: string;
    warning?: string;
}

interface PromiseInfo {
    resolve: (value: boolean | PromiseLike<boolean>) => void;
    reject: (reason?: any) => void;
}

type ShowDialogHandler = (options: DialogOptions) => Promise<boolean>;

// Create the context so we can use it in our App
const DialogContext = createContext<ShowDialogHandler>(() => {
    throw new Error('Component is not wrapped with a DialogProvider.');
});

const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<DialogOptions>({
        title: '',
    });
    const [promiseInfo, setPromiseInfo] = useState<PromiseInfo>();
    const showDialog: ShowDialogHandler = (options) => {
        // When the dialog is shown, keep the promise info so we can resolve later
        return new Promise<boolean>((resolve, reject) => {
            setPromiseInfo({ resolve, reject });
            setOptions(options);
            setOpen(true);
        });
    };
    const handleConfirm = () => {
        // if the Confirm button gets clicked, resolve with `true`
        setOpen(false);
        promiseInfo?.resolve(true);
        setPromiseInfo(undefined);
    };
    const handleCancel = () => {
        // if the dialog gets canceled, resolve with `false`
        setOpen(false);
        promiseInfo?.resolve(false);
        setPromiseInfo(undefined);
    };
    return (
        <>
            <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
                {options.title && <DialogTitle>{options.title}</DialogTitle>}
                <DialogContent>
                    {options.warning && <Alert severity="warning" sx={{ marginBottom: 2.5 }}>{options.warning}</Alert>}
                    {options.message && (
                        <DialogContentText>{options.message}</DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button variant="contained" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <DialogContext.Provider value={showDialog}>
                {children}
            </DialogContext.Provider>
        </>
    );
};

// By calling `useDialog()` in a component we will be able to use the `showDialog()` function
export const useDialog = () => {
    return useContext(DialogContext);
};

export default DialogProvider;