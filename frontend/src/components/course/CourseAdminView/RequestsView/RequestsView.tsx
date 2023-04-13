import { ExpandMore } from "@mui/icons-material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Box,
  Button,
  Collapse,
  Stack
} from "@mui/material";
import { useAssignmentsMap } from "api/assignment/hooks";
import { useSectionsMap } from "api/section/hooks";
import { Course } from "model/course";
import { useEffect, useState } from "react";
import RequestsList from "./RequestsList";
import { usePastSwaps, usePendingSwaps } from "api/swaps/hooks";
import { Assignment } from "model/assignment";
import { Section } from "model/section";
import { CoursePermission } from "model/user";

export interface RequestsViewProps {
  course: Course;
  access: CoursePermission;
  assignmentsMap: Record<string, Assignment>;
  sectionsMap: Record<string, Section>;
}

export default function RequestsView({ course, access, assignmentsMap, sectionsMap }: RequestsViewProps) {
  const [pendingRequests, pendingRequestsLoading] = usePendingSwaps(course.ID);
  const [pendingRequestsOpen, setPendingRequestsOpen] = useState(!pendingRequestsLoading);
  const [pastRequests, pastRequestsLoading] = usePastSwaps(course.ID);
  const [pastRequestsOpen, setPastRequestsOpen] = useState(false);

  useEffect(() => {
    setPendingRequestsOpen(!pendingRequestsLoading);
  }, [pendingRequestsLoading]);

  return (
    <Stack ml={-1} mt={-1}>
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
        <RequestsList {...{ course, assignmentsMap, sectionsMap }} type="pending" requests={pendingRequests} />
      </Collapse>

      <Box height={8} />
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
        <RequestsList {...{ course, assignmentsMap, sectionsMap }} type="past" requests={pastRequests} />
      </Collapse>
    </Stack >
  );
}
