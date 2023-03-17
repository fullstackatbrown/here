import * as React from 'react';
import { FC } from "react";

import { Box, Button } from "@mui/material";
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { LocalizationProvider, DateField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export interface AssignmentDialogProps {
    open: boolean;
    handleClose: () => void;
}

const AssignmentDialog: FC<AssignmentDialogProps> = ({ open, handleClose }) => {

    return (
        <Dialog open={open} onClose={handleClose}>

            <DialogContent>
                <DialogContentText color="secondary" variant="h6" align="center">
                    Input New Assignment
                </DialogContentText>

                <Box>
                    <TextField id="assignment" label="Assignment Name" size="small" variant="outlined" sx={{ m: 2 }} />
                    <Box sx={{ p: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DateField label="Due Date" size="small" />
                        </LocalizationProvider>
                    </Box>
                    <TextField id="points" label="Points" size="small" variant="outlined" sx={{ m: 2 }} />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Add</Button>
            </DialogActions>
        </Dialog>

    )
}

export default AssignmentDialog;