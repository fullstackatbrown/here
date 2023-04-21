import { Stack, Typography } from "@mui/material";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { CoursePermission, User } from "model/user";
import ViewHeader from "@components/course/CourseAdminView/ViewHeader/ViewHeader";
import StudentRequestsList from "./StudentRequestsList";
import { Swap } from "model/swap";

export interface StudentsRequestsViewProps {
    course: Course;
    student: User;
    requests: Swap[];
    sectionsMap: Record<string, Section>;
    assignmentsMap: Record<string, Assignment>;
}

const StudentsRequestsView: FC<StudentsRequestsViewProps> = ({ course, student, requests, sectionsMap, assignmentsMap }) => {
    return (
        <>
            <Stack direction="row" justifyContent="space-between" mb={1} alignItems="center" height={40}>
                <ViewHeader view="my requests" views={["home", "my requests"]} access={CoursePermission.CourseStudent} />
            </Stack>
            <StudentRequestsList {...{ course, sectionsMap, student, requests, assignmentsMap }} />
        </>
    );
};

export default StudentsRequestsView;
