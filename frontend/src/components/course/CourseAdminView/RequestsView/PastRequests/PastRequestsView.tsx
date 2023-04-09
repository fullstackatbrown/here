import { Button, Stack, Typography } from "@mui/material";
import { Swap } from "model/swap";
import { FC } from "react";
import PastRequest from "./PastRequestCard";
import { sortRequestsByTime } from "@util/shared/requestTime";
import { Course } from "model/course";
import { Assignment } from "model/assignment";
import { usePastSwaps } from "api/swaps/hooks";
import { Section } from "model/section";

export interface PastRequestViewProps {
  course: Course;
  assignmentsMap: Record<string, Assignment>;
  sectionsMap: Record<string, Section>;
}

const PastRequestsView: FC<PastRequestViewProps> = ({ course, assignmentsMap, sectionsMap }) => {
  const [pastRequests, _] = usePastSwaps(course.ID);

  return (
    <Stack direction="column">
      {pastRequests && sortRequestsByTime(pastRequests).map((r) => {
        const student = course.students[r.studentID];
        const assignment = r.assignmentID ? assignmentsMap[r.assignmentID] : undefined;
        const oldSection = r.oldSectionID ? sectionsMap[r.oldSectionID] : undefined;
        const newSection = r.newSectionID ? sectionsMap[r.newSectionID] : undefined;
        return <PastRequest key={`request${r.ID}`} request={r} student={student} assignment={assignment}
          oldSection={oldSection} newSection={newSection} />
      })}
    </Stack>
  );
};

export default PastRequestsView;
