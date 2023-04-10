import { Stack, Typography } from "@mui/material";
import errors from "@util/errors";
import { sortRequestsByTime } from "@util/shared/requestTime";
import SwapAPI from "api/swaps/api";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { Swap, SwapStatus } from "model/swap";
import { FC } from "react";
import toast from "react-hot-toast";
import PastRequest from "./PastRequests/PastRequestCard";
import PendingRequest from "./PendingRequests/PendingRequestCard";

export interface RequestsListProps {
  course: Course;
  assignmentsMap: Record<string, Assignment>;
  sectionsMap: Record<string, Section>;
  type: "pending" | "past";
  requests: Swap[];
}

const RequestsList: FC<RequestsListProps> = ({ course, assignmentsMap, sectionsMap, type, requests }) => {

  function handleSwap(request: Swap, status: SwapStatus) {
    toast.promise(SwapAPI.handleSwap(course.ID, request.ID, status, "test_TA"),
      {
        loading: "Updating request...",
        success: "Request updated!",
        error: errors.UNKNOWN,
      })
  }

  return (
    <Stack direction="column" minHeight={60}>
      {requests && requests.length === 0 &&
        (type === "pending" ?
          <Typography variant="body1" ml={1} mr={4} mt={2} textAlign="center">You've handled all requests in your inbox!</Typography> :
          <Typography variant="body1" ml={1} mr={4} mt={2} textAlign="center">You have no past requests</Typography>)
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
