import { Stack } from "@mui/material";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { Swap } from "model/swap";
import { User } from "model/user";
import { FC } from "react";
import StudentViewHeader from "../StudentViewHeader";
import StudentRequestsList from "./StudentRequestsList";

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
            <StudentViewHeader view="my requests" />
            <StudentRequestsList {...{ course, sectionsMap, student, requests, assignmentsMap }} />
        </>
    );
};

export default StudentsRequestsView;
