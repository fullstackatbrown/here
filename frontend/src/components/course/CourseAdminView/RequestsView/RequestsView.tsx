import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Stack
} from "@mui/material";
import { useSwaps } from "api/swaps/hooks";
import { Course } from "model/course";
import { useState } from "react";
import PastRequestsView from "./PastRequests/PastRequestsView";
import PendingRequestsView from "./PendingRequests/PendingRequestsView";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useAssignments, useAssignmentsMap } from "api/assignment/hooks";

export interface RequestsViewProps {
  course: Course;
}

export default function RequestsView({ course }: RequestsViewProps) {
  const [pendingRequestsOpen, setPendingRequestsOpen] = useState(true);
  const [pastRequestsOpen, setPastRequestsOpen] = useState(false);
  const [assignmentsMap, assignmentsMapLoading] = useAssignmentsMap(course.ID);

  const [swapRequests, swapRequestsLoading] = useSwaps(course.ID);
  const pendingSwapRequests = swapRequests.filter(
    (r) => r.status === "pending"
  );
  const pastSwapRequests = swapRequests.filter((r) => r.status !== "pending");

  return (
    <Stack spacing={2} ml={-1} mt={-1}>
      <Stack direction="row" justifyContent="space-between">
        <Button
          color="inherit" variant="text" sx={{ fontSize: 17 }}
          startIcon={pendingRequestsOpen ? <ExpandMore /> : <KeyboardArrowRightIcon />}
          onClick={() => setPendingRequestsOpen(!pendingRequestsOpen)}
        >
          Pending Requests
        </Button>
      </Stack>
      <Collapse in={pendingRequestsOpen} timeout="auto" unmountOnExit>
        <Box>
          <PendingRequestsView course={course} assignmentsMap={assignmentsMap} />
        </Box>
      </Collapse>

      <Stack direction="row" justifyContent="space-between">
        <Button
          color="inherit" variant="text" sx={{ fontSize: 17 }}
          startIcon={pastRequestsOpen ? <ExpandMore /> : <KeyboardArrowRightIcon />}
          onClick={() => setPastRequestsOpen(!pastRequestsOpen)}
        >
          Past Requests
        </Button>
      </Stack>
      <Collapse in={pastRequestsOpen} timeout="auto" unmountOnExit>
        <PastRequestsView pastRequests={pastSwapRequests} />
      </Collapse>
    </Stack >
  );
}
