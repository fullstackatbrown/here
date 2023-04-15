import AddPermissionButton from "@components/shared/AddPermissionButton/AddPermissionButton";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    Typography
} from "@mui/material";
import { Course } from "model/course";
import { CoursePermission } from "model/user";
import { FC, useState } from "react";

export interface AddStudentDialogProps {
    course: Course;
    open: boolean;
    onClose: () => void;
}

const AddStudentDialog: FC<AddStudentDialogProps> = ({ course, open, onClose }) => {
    const [emailsAdded, setEmailsAdded] = useState<string[]>([])
    const [errors, setErrors] = useState<Record<string, string> | undefined>(undefined)

    const handleOnClose = () => {
        onClose();
        setEmailsAdded([]);
        setErrors(undefined);
    };

    const addEmail = (emails: string[]) => {
        setEmailsAdded([...emailsAdded, ...emails])
    }

    const addErrors = (errors: Record<string, string>) => {
        // errors is a map from email to error message
        setErrors(errors);
    }

    const placeholder =
        ["Enter student email\nor emails separated by new lines\nPress enter to submit",
            "Example:\njenny_yu2@brown.edu\nhammad_izhar@brown.edu"
        ]

    return <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm" keepMounted={false}>
        <DialogTitle>Add Student</DialogTitle>
        <DialogContent sx={{ minHeight: 300 }}>
            <Grid container>
                <Grid item xs={6}>
                    <AddPermissionButton
                        course={course} access={CoursePermission.CourseStudent}
                        successCallback={addEmail} errorsCallback={addErrors}
                        autoFocus multiline
                        placeholder={placeholder.join("\n\n")}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={1} mt={0.3} ml={3.5}>
                        {emailsAdded.length == 0 && !errors &&
                            <Typography color="text.disabled" sx={{ fontSize: 14 }}>Students added will appear here</Typography>}
                        {emailsAdded.length > 0 && emailsAdded.map((email) =>
                            <Typography key={email} sx={{ fontSize: 14 }}>{email}</Typography>
                        )}
                        {errors && Object.entries(errors).map(([email, error]) =>
                            <Typography key={email} sx={{ fontSize: 14, color: "error.main" }}>{email}: {error}</Typography>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </DialogContent>

    </Dialog >;
};

export default AddStudentDialog;


