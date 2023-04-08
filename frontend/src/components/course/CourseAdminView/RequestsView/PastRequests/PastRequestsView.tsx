import { Button, Stack, Typography } from "@mui/material";
import { Swap } from "model/swap";
import { FC } from "react";
import PastRequest from "./PastRequestCard";
import { sortRequestsByTime } from "@util/shared/requestTime";
import { Course } from "model/course";
import { Assignment } from "model/assignment";
import { usePastSwaps } from "api/swaps/hooks";

export interface PastRequestViewProps {
  course: Course;
  assignmentsMap: Record<string, Assignment>;
}

const PastRequestsView: FC<PastRequestViewProps> = ({ course, assignmentsMap }) => {
  const [pastRequests, _] = usePastSwaps(course.ID);

  return (
    <Stack direction="column">
      {sortRequestsByTime(pastRequests).map((r) => (
        <PastRequest key={`request${r.ID}`} request={r} />
      ))}
    </Stack>
  );
};

export default PastRequestsView;
