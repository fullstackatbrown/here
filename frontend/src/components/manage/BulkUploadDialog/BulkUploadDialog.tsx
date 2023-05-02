import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Step, StepLabel, Stepper, Typography, useTheme } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { parseCourses, parseStaffData } from "@util/shared/parseBulkUpload";
import { getCurrentTerm } from "@util/shared/terms";
import CourseAPI from "api/course/api";
import { AddPermissionRequest, Course, createCourseAndPermissionsRequest } from "model/course";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import AddCoursesStep from "./AddCoursesStep";
import AddStaffStep from "./AddStaffStep";
import ConfirmUploadStep from "./ConfirmUploadStep";
import SelectTermStep from "./SelectTermStep";

export interface BulkUploadDialogProps {
    open: boolean;
    onClose: () => void;
    coursesByTerm: Record<string, Course[]>;
}

const steps = ['Select Term', 'Add Courses', 'Add Admin & Staff', 'Confirm'];

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

const BulkUploadDialog: FC<BulkUploadDialogProps> = ({ open, onClose, coursesByTerm }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState<[number, string] | undefined>(undefined);

    const [term, setTerm] = useState<string>(getCurrentTerm());
    const [addCoursesData, setAddCoursesData] = useState<string>("");
    const [addStaffData, setAddStaffData] = useState<string>("");

    const [courses, setCourses] = useState<Record<string, string> | undefined>(undefined);
    const [permissionsByCourse, setPermissionsByCourse] = useState<Record<string, AddPermissionRequest[]> | undefined>(undefined);

    const theme = useTheme();

    const handleNext = () => { setActiveStep((prevActiveStep) => prevActiveStep + 1); };

    const handleBack = () => {
        setError(undefined);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const reset = () => {
        setTerm(getCurrentTerm());
        setCourses(undefined);
        setActiveStep(0);
        setError(undefined);
        setAddCoursesData("");
        setAddStaffData("");
        setPermissionsByCourse(undefined);
    }

    const handleAddCourses = () => {
        setError(undefined)
        const [newCourses, coursesError] = parseCourses(addCoursesData)
        if (coursesError !== undefined) {
            setError([1, coursesError])
            return
        }

        const numExistingCourses = coursesByTerm[term]?.length ?? 0
        if (!(Object.keys(newCourses).length || numExistingCourses)) {
            setError([1, "There must be at least one valid course"])
            return
        }

        for (const courseCode in newCourses) {
            if (coursesByTerm[term]?.find(course => course.code === courseCode)) {
                setError([1, `Course ${courseCode} already exists`])
                return
            }
        }

        const allCourses = { ...coursesByTerm[term]?.reduce((acc, curr) => { acc[curr.code] = curr.title; return acc }, {}), ...newCourses }
        setCourses(allCourses)
        handleNext()
    }

    const handleAddStaff = () => {
        setError(undefined)

        const [permissions, error] = parseStaffData(addStaffData, courses)
        if (error !== undefined) {
            setError([2, error])
            return
        }

        setPermissionsByCourse(permissions)
        handleNext()
    }

    const handleConfirmUpload = () => {
        let courseAndPermReqs: createCourseAndPermissionsRequest[] = []

        for (const courseCode in courses!) {
            courseAndPermReqs.push({
                code: courseCode,
                title: courses![courseCode],
                term: term!,
                permissions: permissionsByCourse![courseCode] || []
            })
        }

        // loop through each course 
        toast.promise(CourseAPI.bulkUpload(courseAndPermReqs), {
            loading: "Uploading...",
            success: "Upload successful",
            error: (err) => handleBadRequestError(err)
        })
            .then(() => {
                handleClose();
            })
            .catch(() => { })
    }

    const handleClose = () => {
        onClose()
        reset()
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
                    const stepProps: { completed?: boolean, } = {};
                    const labelProps: { error?: boolean; } = {};
                    if (error?.[0] === index) { labelProps.error = true; }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <Box mt={3} ml={1} mb={2}>
                <Box ml={-0.5} my={2}>
                    {
                        {
                            0: <SelectTermStep {...{ term, setTerm }} />,
                            1: <AddCoursesStep {...{ term, addCoursesData, setAddCoursesData }} courses={coursesByTerm[term] || []} />,
                            2: <AddStaffStep {...{ term, courses, addStaffData, setAddStaffData }} />,
                            3: <ConfirmUploadStep {...{ term, courses, permissionsByCourse }} />,
                        }[activeStep]
                    }
                </Box>
                {error && <Typography color={theme.palette.error.main} fontWeight={500}>{error[1]}</Typography>}
            </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", mx: 1 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Stack direction="row" spacing={2}>
                {!(activeStep === 0) && <Button onClick={handleBack} sx={{ mr: 1 }}>Back</Button>}
                {
                    {
                        0: <Button onClick={handleNext} variant="contained">Next</Button>,
                        1: <Button onClick={handleAddCourses} variant="contained">Next</Button>,
                        2: <Button onClick={handleAddStaff} variant="contained">Next</Button>,
                        3: <Button onClick={handleConfirmUpload} variant="contained">Confirm Upload</Button>,
                    }[activeStep]
                }
            </Stack>
        </DialogActions>
    </Dialog >;
};

export default BulkUploadDialog;


