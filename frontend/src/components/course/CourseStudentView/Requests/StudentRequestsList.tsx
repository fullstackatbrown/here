import { Button, Stack, Typography } from "@mui/material";
import { Swap, SwapStatus } from "model/swap";
import { FC } from "react";
import { sortRequestsByTime } from "@util/shared/requestTime";
import { Course } from "model/course";
import { usePastSwaps, usePendingSwaps } from "api/swaps/hooks";
import { Assignment } from "model/assignment";
import { Section } from "model/section";
import errors from "@util/errors";
import SwapAPI from "api/swaps/api";
import { request } from "http";
import toast from "react-hot-toast";
import { User } from "model/user";
import StudentRequestCard from "./StudentRequestCard";

export interface StudentRequestsListProps {
    course: Course;
    student: User;
    assignmentsMap: Record<string, Assignment>;
    sectionsMap: Record<string, Section>;
    type: "pending" | "past";
}

const StudentRequestsList: FC<StudentRequestsListProps> = ({ course, student, assignmentsMap, sectionsMap, type }) => {
    const [requests, _] = type === "pending" ? usePendingSwaps(course.ID, student.ID) : usePastSwaps(course.ID, student.ID);

    function handleCancelSwap(request: Swap) {
        toast.promise(SwapAPI.cancelSwap(course.ID, request.ID),
            {
                loading: "Cancelling request...",
                success: "Request cancelled!",
                error: errors.UNKNOWN,
            })
    }

    return (
        <Stack direction="column" minHeight={60}>
            {requests && requests.length === 0 &&
                (type === "pending" ?
                    <Typography variant="body1" ml={1} mr={4} mt={2} textAlign="center">You have no pending requests</Typography> :
                    <Typography variant="body1" ml={1} mr={4} mt={2} textAlign="center">You have no past requests</Typography>)
            }
            {requests && assignmentsMap && sectionsMap && sortRequestsByTime(requests).map((r) => {
                const student = course.students[r.studentID];
                const assignment = r.assignmentID ? assignmentsMap[r.assignmentID] : undefined;
                const oldSection = r.oldSectionID ? sectionsMap[r.oldSectionID] : undefined;
                const newSection = r.newSectionID ? sectionsMap[r.newSectionID] : undefined;
                return <StudentRequestCard
                    key={`request${r.ID}`}
                    request={r} student={student} assignment={assignment}
                    oldSection={oldSection} newSection={newSection} pending={type === "pending"}
                    handleCancelSwap={type === "pending" && handleCancelSwap}
                />
            })}
        </Stack>
    );
};

export default StudentRequestsList;
