import { Button, Stack } from "@mui/material";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { Swap } from "model/swap";
import { User } from "model/user";
import { FC, useState } from "react";
import StudentViewHeader from "../StudentViewHeader";
import StudentRequestsList from "./StudentRequestsList";
import SwapRequestDialog from "./SwapRequestDialog";

export interface StudentsRequestsViewProps {
    course: Course;
    student: User;
    requests: Swap[];
    sectionsMap: Record<string, Section>;
    assignmentsMap: Record<string, Assignment>;
}

const StudentsRequestsView: FC<StudentsRequestsViewProps> = ({ course, student, requests, sectionsMap, assignmentsMap }) => {
    const [swapRequestDialog, setSwapRequestDialog] = useState(false)

    return (
        <>
            {assignmentsMap && sectionsMap &&
                <SwapRequestDialog
                    open={swapRequestDialog}
                    onClose={() => { setSwapRequestDialog(false) }}
                    {...{ course, assignmentsMap, student, sectionsMap }}
                />}
            <StudentViewHeader
                view="my requests"
                endElement={
                    <Button size="small" onClick={() => setSwapRequestDialog(true)}>
                        + New Request
                    </Button>}
            />
            <StudentRequestsList {...{ course, sectionsMap, student, requests, assignmentsMap }} />
        </>
    );
};

export default StudentsRequestsView;
