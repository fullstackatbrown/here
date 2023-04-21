import { Stack } from "@mui/material";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { User } from "model/user";
import { FC } from "react";
import StudentViewHeader from "../StudentViewHeader";

export interface StudentSettingsViewProps {
    course: Course;
}

const StudentSettingsView: FC<StudentSettingsViewProps> = ({ course }) => {

    const quitCourse = () => {
        const confirmed = confirm("Are you sure you want to quit this course?");
        if (confirmed) {
        }
    };

    return (
        <>
            <StudentViewHeader view="settings" />
            <Stack direction="row" justifyContent="space-between" spacing={1}>
            </Stack>

        </>
    );
};

export default StudentSettingsView;
