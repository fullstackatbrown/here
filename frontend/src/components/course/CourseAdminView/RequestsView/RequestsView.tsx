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
import { useState } from "react";
import PastRequestsView from "./PastRequests/PastRequestsView";
import PendingRequestsView from "./PendingRequests/PendingRequestsView";

export interface RequestsViewProps {
  course: Course;
}

export default function RequestsView({ course }: RequestsViewProps) {
  const [pendingRequestsOpen, setPendingRequestsOpen] = useState(true);
  const [pastRequestsOpen, setPastRequestsOpen] = useState(false);
  const [assignmentsMap, assignmentsMapLoading] = useAssignmentsMap(course.ID);
  const [sectionsMap, sectionsMapLoading] = useSectionsMap(course.ID);

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
        <PendingRequestsView course={course} assignmentsMap={assignmentsMap} sectionsMap={sectionsMap} />
      </Collapse>

      <Box height={10} />
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
        <PastRequestsView course={course} assignmentsMap={assignmentsMap} sectionsMap={sectionsMap} />
      </Collapse>
    </Stack >
  );
}
