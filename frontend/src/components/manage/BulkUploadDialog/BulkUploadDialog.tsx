import { FC, useState } from "react";
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Step, StepLabel, Stepper, TextField, Typography, useTheme } from "@mui/material";
import Button from "@components/shared/Button";
import { useForm } from "react-hook-form";
import AddCoursesStep, { AddCoursesData } from "./AddCoursesStep";
import { parseCourses, parseTerm } from "@util/shared/parseBulkUpload";
import AddStaffStep, { AddStaffData } from "./AddStaffStep";
import { capitalizeFirstLetter } from "@util/shared/string";

// TODO: handle term name

export interface BulkUploadDialogProps {
    open: boolean;
    onClose: () => void;
}

const steps = ['Add Courses', 'Add Admin & Staff', 'Validate Data', 'Upload Success'];

const instructions = [
    [
        "Paste comma-separated values with the following schema: (course_code,course_name). E.g.",
        "Rows with empty course codes or names will be ignored",
    ],
    [
        "Paste comma-separated values with the following schema: (email,[staff/admin],course_code). E.g.",
        "Rows with invalid emails or staff options will be ignored.",
    ],
    [],
    []
]

export interface BulkUploadRequest {
    term: string;
    courses: {
        code: string;
        title: string;
    };
    staff: {
        email: string;
        role: string;
        course: string;
    };
}



const BulkUploadDialog: FC<BulkUploadDialogProps> = ({ open, onClose }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState<[number, string] | undefined>(undefined);
    const [addCoursesData, setAddCoursesData] = useState<AddCoursesData | undefined>({ term: "", data: "" });
    const [term, setTerm] = useState<string | undefined>(undefined);
    const [courses, setCourses] = useState<Record<string, string> | undefined>(undefined);

    const [addStaffData, setAddStaffData] = useState<AddStaffData>({ data: "" });

    const theme = useTheme();

    const handleNext = () => { setActiveStep((prevActiveStep) => prevActiveStep + 1); };

    const handleBack = () => { setActiveStep((prevActiveStep) => prevActiveStep - 1); };

    const reset = () => {
        setTerm(undefined);
        setCourses(undefined);
        setActiveStep(0);
        setError(undefined);
        setAddCoursesData({ term: "", data: "" });
    }

    const handleAddCourses = () => {
        setError(undefined)

        if (addCoursesData.data === "" || addCoursesData.term === "") {
            setError([0, "All fields must be filled out"])
            return
        }

        const [term, termError] = parseTerm(addCoursesData!.term)
        if (termError !== undefined) {
            setError([0, termError])
            return
        }

        const [courses, coursesError] = parseCourses(addCoursesData!.data)
        if (coursesError !== undefined) {
            setError([0, coursesError])
            return
        }

        setTerm(term)
        setCourses(courses)

        handleNext()
    }

    const handleValidateData = () => {
        handleNext()
    }

    const handleUpload = () => {
        handleNext()
    }

    const handleClose = () => {
        onClose()
        reset()
    }

    const formatCourseCodes = (courseCodes: string[]) => {
        return courseCodes.reduce((acc, curr) => {
            return acc + ", " + curr
        })
    }

    return <Dialog
        open={open}
        onClose={(e, reason) => {
            if (reason !== 'backdropClick') handleClose()
        }}
        fullWidth maxWidth="md"
    >
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
                    if (error?.[0] === index) {
                        labelProps.error = true;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <Box mt={3} ml={1} mb={2}>
                {instructions[activeStep].map(
                    (row: string) =>
                        <Typography mb={0.5} key={row}>
                            {row}
                        </Typography>
                )}
                {activeStep === 1 &&
                    <Typography mt={1.5} fontWeight={500}>{capitalizeFirstLetter(term)} Courses: {formatCourseCodes(Object.keys(courses!))}</Typography>
                }
                <Box ml={-0.5} my={2}>
                    {
                        {
                            0: <AddCoursesStep addCoursesData={addCoursesData} setAddCoursesData={setAddCoursesData} />,
                            1: <AddStaffStep addStaffData={addStaffData} setAddStaffData={setAddStaffData} />,
                            2: <></>,
                            3: <Typography textAlign="center" mt={8} fontSize={18}>
                                Successfully added N courses for term XXX!
                            </Typography>
                        }[activeStep]
                    }
                </Box>
                {error && <Typography color={theme.palette.error.main} fontWeight={500}>{error[1]}</Typography>}
            </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", mx: 1 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Stack direction="row" spacing={2}>

                <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
                {/* {!(activeStep === 0 || activeStep === steps.length - 1) && <Button onClick={handleBack} sx={{ mr: 1 }}>Back</Button>} */}
                {
                    {
                        0: <Button onClick={handleAddCourses} variant="contained">Next</Button>,
                        1: <Button onClick={handleValidateData} variant="contained">Validate</Button>,
                        2: <Button onClick={handleUpload} variant="contained">Upload</Button>,
                        3: <Button onClick={handleClose} variant="contained">Complete</Button>
                    }[activeStep]
                }
            </Stack>
        </DialogActions>
    </Dialog >;
};

export default BulkUploadDialog;


