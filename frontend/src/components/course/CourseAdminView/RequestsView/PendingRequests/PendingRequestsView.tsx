import { Button, Stack, Typography } from "@mui/material";
import { Swap } from "model/swap";
import { FC } from "react";
import PendingRequest from "./PendingRequestCard";
import { sortRequestsByTime } from "@util/shared/requestTime";
import { Course } from "model/course";
import { usePendingSwaps } from "api/swaps/hooks";
import { Assignment } from "model/assignment";

export interface PendingRequestViewProps {
  course: Course;
  assignmentsMap: Record<string, Assignment>;
}

const PendingRequestsView: FC<PendingRequestViewProps> = ({ course, assignmentsMap }) => {
  const [pendingRequests, _] = usePendingSwaps(course.ID);

  return (
    <Stack direction="column">
      {pendingRequests && sortRequestsByTime(pendingRequests).map((r) => {
        const student = course.students[r.studentID];
        const assignment = r.assignmentID ? assignmentsMap[r.assignmentID] : undefined;
        return <PendingRequest key={`request${r.ID}`} request={r} student={student} assignment={assignment} />
      })}
    </Stack>
  );
};

export default PendingRequestsView;
