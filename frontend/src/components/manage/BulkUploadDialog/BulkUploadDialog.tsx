import { FC, useState } from "react";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import Button from "@components/shared/Button";
import { useForm } from "react-hook-form";

export interface BulkUploadDialogProps {
    open: boolean;
    onClose: () => void;
}

type FormData = {
    term: string;
    data: string;
};

const steps = ['Add Courses', 'Add Admin & Staff', 'Validate Data', 'Upload Success'];

const instructions = [
    [
        "Paste comma-separated values with the following schema: (course_code, course_name). E.g.",
        "cs1300,User Interface and User Experience",
        "cs0200,Program Design with Data Structures and Algorithms",
    ],
    [
        "Paste comma-separated values with the following schema: (email, [UTA/HTA], course_code, course_name).",
        "Rows with invalid emails or any staff option that isn't 'UTA' or 'HTA' will be dropped. If a course_code maps to multiple different non-empty course_names, an arbitrary one will be chosen.",
        "If you use a previously used term name, unexpected behaviour may ensue."
    ],
    [],
    []
]


const BulkUploadDialog: FC<BulkUploadDialogProps> = ({ open, onClose }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState<number | undefined>(undefined);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleValidateData = () => {
        handleNext()
    }

    const handleUpload = () => {
        handleNext()
    }

    const handleClose = (event: React.SyntheticEvent, reason: string) => {
        // Prevent backdrop click from closing dialog
        if (reason !== 'backdropClick') {
            onClose()
        }
    }

    return <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" >
        <DialogTitle>Bulk Upload</DialogTitle>
        <DialogContent sx={{ minHeight: 400 }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps: {
                        completed?: boolean,
                    } = {};
                    const labelProps: {
                        error?: boolean;
                    } = {};
                    if (error === index) {
                        labelProps.error = true;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <Box mt={3} ml={0.5} mb={2}>
                {instructions[activeStep].map(
                    (row: string) =>
                        <Typography style={{ marginBottom: 1.5 }}
                            key={row}>{row}
                        </Typography>
                )}
            </Box>
            {activeStep === 0 && (
                <Stack spacing={2} my={1}>
                    <TextField
                        required
                        label="Term"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                    />
                    <TextField
                        required
                        autoFocus
                        label="CSV Data"
                        type="textarea"
                        fullWidth
                        multiline
                        rows={8}
                        size="small"
                        variant="outlined"
                    />
                </Stack>
            )}
            {activeStep === 1 && (
                <Stack spacing={2} my={1}>
                </Stack>
            )}
            {activeStep === 2 && (
                <Typography textAlign="center" mt={8} fontSize={18}>
                    Successfully added N courses for term XXX!
                </Typography>
            )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", mx: 1 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Stack direction="row" spacing={2}>

                <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
                {/* {!(activeStep === 0 || activeStep === steps.length - 1) && <Button onClick={handleBack} sx={{ mr: 1 }}>Back</Button>} */}
                {
                    {
                        0: <Button onClick={handleValidateData} variant="contained">Validate</Button>,
                        1: <Button onClick={handleValidateData} variant="contained">Validate</Button>,
                        2: <Button onClick={handleUpload} variant="contained">Upload</Button>,
                        3: <Button onClick={onClose} variant="contained">Complete</Button>
                    }[activeStep]
                }
            </Stack>
        </DialogActions>
    </Dialog >;
};

export default BulkUploadDialog;


