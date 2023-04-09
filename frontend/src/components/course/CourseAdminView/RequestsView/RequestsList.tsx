import { Button, Stack, Typography } from "@mui/material";
import { Swap, SwapStatus } from "model/swap";
import { FC } from "react";
import { sortRequestsByTime } from "@util/shared/requestTime";
import { Course } from "model/course";
import { usePastSwaps, usePendingSwaps } from "api/swaps/hooks";
import { Assignment } from "model/assignment";
import { Section } from "model/section";
import PastRequest from "./PastRequests/PastRequestCard";
import PendingRequest from "./PendingRequests/PendingRequestCard";
import errors from "@util/errors";
import SwapAPI from "api/swaps/api";
import { request } from "http";
import toast from "react-hot-toast";

export interface RequestsListProps {
  course: Course;
  assignmentsMap: Record<string, Assignment>;
  sectionsMap: Record<string, Section>;
  type: "pending" | "past";
}

const RequestsList: FC<RequestsListProps> = ({ course, assignmentsMap, sectionsMap, type }) => {
  const [requests, _] = type === "pending" ? usePendingSwaps(course.ID) : usePastSwaps(course.ID);

  function handleSwap(request: Swap, status: SwapStatus) {
    toast.promise(SwapAPI.handleSwap(course.ID, request.ID, status, "test_TA"),
      {
        loading: "Updating request...",
        success: "Request updated!",
        error: errors.UNKNOWN,
      })
  }

  return (
    <Stack direction="column">
      {requests && requests.length === 0 &&
        (type === "pending" ?
          <Typography variant="body1" mx={4} mt={2} mb={4} textAlign="center">You've handled all requests in your inbox!</Typography> :
          <Typography variant="body1" mx={4} mt={2} mb={4} textAlign="center">You have no past requests</Typography>)
      }
      {requests && assignmentsMap && sectionsMap && sortRequestsByTime(requests).map((r) => {
        const student = course.students[r.studentID];
        const assignment = r.assignmentID ? assignmentsMap[r.assignmentID] : undefined;
        const oldSection = r.oldSectionID ? sectionsMap[r.oldSectionID] : undefined;
        const newSection = r.newSectionID ? sectionsMap[r.newSectionID] : undefined;
        return type === "pending" ?
          <PendingRequest
            key={`request${r.ID}`}
            request={r} student={student} assignment={assignment}
            oldSection={oldSection} newSection={newSection}
            handleSwap={handleSwap} /> :
          <PastRequest
            key={`request${r.ID}`}
            request={r} student={student} assignment={assignment}
            oldSection={oldSection} newSection={newSection}
            handleSwap={handleSwap} />
      })}
    </Stack>
  );
};

export default RequestsList;
