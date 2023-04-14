import StudentGradesTable from "@components/course/CourseStudentView/Grades/StudentGradesTable";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import AuthAPI from "api/auth/api";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { User } from "model/user";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface StudentDialogDialogProps {
    course: Course;
    assignments: Assignment[];
    sectionsMap: Record<string, Section>;
    studentID: string;
    open: boolean;
    onClose: () => void;
}

const StudentDialogDialog: FC<StudentDialogDialogProps> = ({ course, studentID, assignments, sectionsMap, open, onClose }) => {

    const [student, setStudent] = useState<User | undefined>(undefined);

    useEffect(() => {
        if (studentID && studentID != "") {
            AuthAPI.getUserById(studentID)
                .then(res => {
                    setStudent(res);
                })
        }
    }, [studentID]);

    const handleOnClose = () => {
        onClose();
    };

    return student && <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm" keepMounted={false}>
        <DialogTitle>{student.displayName} </DialogTitle>
        <DialogContent>
            <Typography>{student.email}</Typography>
            <Typography>Regular Section: {student.defaultSection?.[course.ID] || "Unassigned"}</Typography>
            <StudentGradesTable {...{ course, student, assignments, sectionsMap }} />
        </DialogContent>
    </Dialog>;
};

export default StudentDialogDialog;


