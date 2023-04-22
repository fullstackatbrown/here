import StudentGradesTable from "@components/course/CourseStudentView/Home/StudentGradesTable";
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import AuthAPI from "api/auth/api";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { User } from "model/user";
import { FC, useEffect, useState } from "react";

export interface StudentDialogProps {
    course: Course;
    assignments: Assignment[];
    sectionsMap: Record<string, Section>;
    studentID: string;
    open: boolean;
    onClose: () => void;
}

const StudentDialog: FC<StudentDialogProps> = ({ course, studentID, assignments, sectionsMap, open, onClose }) => {

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

    const getDefaultSection = () => {
        const defaultSection = student?.defaultSections?.[course.ID]
        if (defaultSection && defaultSection !== "" && sectionsMap) {
            return formatSectionInfo(sectionsMap[defaultSection], true)
        }
        return undefined
    }

    return student && <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="md" keepMounted={false}>
        <DialogTitle>{student.displayName} ({student.email})</DialogTitle>
        <DialogContent>
            <Typography fontSize={15}>
                <Box component="span" fontWeight={500}>Regular Section:</Box>&nbsp;
                {getDefaultSection() || "Unassigned"}
            </Typography>
            <StudentGradesTable {...{ course, student, sectionsMap, assignments }} />
        </DialogContent>
    </Dialog >;
};

export default StudentDialog;


