import { Button, Theme, Tooltip, useMediaQuery } from "@mui/material";
import { Assignment } from "model/assignment";
import { Course, CourseStatus } from "model/course";
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
    const allowRequests = course.status === CourseStatus.CourseActive && student.defaultSections?.[course.ID] !== undefined
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

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
                // button doesnt show on mobile if requests are not allowed
                endElement={!(isXsScreen && !allowRequests) &&
                    <Tooltip
                        title="Enabled after regular section is assigned"
                        disableHoverListener={allowRequests}
                        disableFocusListener={allowRequests}
                        placement="right">
                        <span>
                            <Button
                                size="small"
                                onClick={() => setSwapRequestDialog(true)}
                                disabled={!allowRequests}
                            >
                                + New Request
                            </Button>
                        </span>
                    </Tooltip >
                }
            />
            < StudentRequestsList {...{ course, sectionsMap, student, requests, assignmentsMap }} />
        </>
    );
};

export default StudentsRequestsView;
