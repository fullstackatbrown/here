import { Button, Stack, Typography } from "@mui/material";
import { Swap } from "model/swap";
import { FC } from "react";
import PendingRequest from "./PendingRequestCard";
import { sortRequestsByTime } from "@util/shared/requestTime";
import { Course } from "model/course";
import { usePendingSwaps } from "api/swaps/hooks";
import { Assignment } from "model/assignment";
import { Section } from "model/section";

export interface PendingRequestViewProps {
  course: Course;
  assignmentsMap: Record<string, Assignment>;
  sectionsMap: Record<string, Section>;
}

const PendingRequestsView: FC<PendingRequestViewProps> = ({ course, assignmentsMap, sectionsMap }) => {
  const [pendingRequests, _] = usePendingSwaps(course.ID);

  return (
    <Stack direction="column">
      {pendingRequests && assignmentsMap && sectionsMap && sortRequestsByTime(pendingRequests).map((r) => {
        const student = course.students[r.studentID];
        const assignment = r.assignmentID ? assignmentsMap[r.assignmentID] : undefined;
        const oldSection = r.oldSectionID ? sectionsMap[r.oldSectionID] : undefined;
        const newSection = r.newSectionID ? sectionsMap[r.newSectionID] : undefined;
        return <PendingRequest
          key={`request${r.ID}`}
          request={r} student={student} assignment={assignment}
          oldSection={oldSection} newSection={newSection} />
      })}
    </Stack>
  );
};

export default PendingRequestsView;
