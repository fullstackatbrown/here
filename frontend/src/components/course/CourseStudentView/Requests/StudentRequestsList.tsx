import { Stack, Typography } from "@mui/material";
import errors from "@util/errors";
import { sortRequestsByTime } from "@util/shared/requestTime";
import { useAssignmentsMap } from "api/assignment/hooks";
import { useSectionsMap } from "api/section/hooks";
import SwapAPI from "api/swaps/api";
import { useSwapsByStudent } from "api/swaps/hooks";
import { Course } from "model/course";
import { Swap } from "model/swap";
import { User } from "model/user";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import StudentRequestCard from "./StudentRequestCard";
import SwapRequestDialog from "./SwapRequestDialog";

export interface StudentRequestsListProps {
    course: Course;
    student: User;
}

const StudentRequestsList: FC<StudentRequestsListProps> = ({ course, student }) => {
    const [requests, _] = useSwapsByStudent(course.ID, student.ID);
    const [assignmentsMap, assignmentsMapLoading] = useAssignmentsMap(course.ID);
    const [sectionsMap, sectionsMapLoading] = useSectionsMap(course.ID);
    const [swapRequestDialog, setSwapRequestDialog] = useState<Swap | undefined>(undefined)

    const handleOpenSwapRequestDialog = (swap: Swap) => {
        setSwapRequestDialog(swap);
    };

    return (
        requests && assignmentsMap && sectionsMap &&
        <>
            <SwapRequestDialog
                open={swapRequestDialog !== undefined}
                onClose={() => { setSwapRequestDialog(undefined) }}
                course={course}
                assignments={Object.values(assignmentsMap)}
                student={student}
                sectionsMap={sectionsMap}
                swap={swapRequestDialog}
            />
            <Stack direction="column" minHeight={60}>
                {requests.length === 0 &&
                    <Typography variant="body1" ml={1} mr={4} mt={2} textAlign="center">You have made no swap requests</Typography>
                }
                {sortRequestsByTime(requests).map((r) => {
                    const student = course.students[r.studentID];
                    const assignment = r.assignmentID ? assignmentsMap[r.assignmentID] : undefined;
                    const oldSection = r.oldSectionID ? sectionsMap[r.oldSectionID] : undefined;
                    const newSection = r.newSectionID ? sectionsMap[r.newSectionID] : undefined;
                    return <StudentRequestCard
                        key={`request${r.ID}`}
                        request={r} courseID={course.ID} student={student} assignment={assignment}
                        oldSection={oldSection} newSection={newSection} pending={r.status === "pending"}
                        handleOpenSwapRequestDialog={handleOpenSwapRequestDialog}
                    />
                })}
            </Stack>
        </>
    );
};

export default StudentRequestsList;
