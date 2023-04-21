import StudentGradesTable from "@components/course/CourseStudentView/Home/StudentGradesTable";
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";
import AuthAPI from "api/auth/api";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { User } from "model/user";
import { FC, useEffect, useState } from "react";

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

    return student && <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="md" keepMounted={false}>
        <DialogTitle>{student.displayName} ({student.email})</DialogTitle>
        <DialogContent>
            <Typography fontSize={15}>
                <Box component="span" fontWeight={500}>Regular Section:</Box>&nbsp;
                {student.defaultSection?.[course.ID] || "Unassigned"}
            </Typography>
            <StudentGradesTable course={course} student={student} assignments={assignments} sectionsMap={sectionsMap} />
        </DialogContent>
    </Dialog >;
};

export default StudentDialogDialog;


