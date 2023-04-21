import { ExpandMore } from "@mui/icons-material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Box,
  Button,
  Collapse,
  Stack
} from "@mui/material";
import { usePastSwaps, usePendingSwaps } from "api/swaps/hooks";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { useEffect, useState } from "react";
import ViewHeader from "../../../shared/ViewHeader/ViewHeader";
import RequestsList from "./RequestsList";
import { CoursePermission } from "model/user";
import AdminViewHeader from "../AdminViewHeader";

export interface RequestsViewProps {
  course: Course;
  access: CoursePermission;
  sectionsMap: Record<string, Section>;
  assignmentsMap: Record<string, Assignment>;
}

export default function RequestsView({ course, access, sectionsMap, assignmentsMap }: RequestsViewProps) {
  const [pendingRequests, pendingRequestsLoading] = usePendingSwaps(course.ID);
  const [pendingRequestsOpen, setPendingRequestsOpen] = useState(!pendingRequestsLoading);
  const [pastRequests, pastRequestsLoading] = usePastSwaps(course.ID);
  const [pastRequestsOpen, setPastRequestsOpen] = useState(false);

  useEffect(() => {
    setPendingRequestsOpen(!pendingRequestsLoading);
  }, [pendingRequestsLoading]);

  return (
    <>
      <AdminViewHeader view="requests" access={access} />
      <Stack ml={-1}>
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

        <Box height={20} />
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
    </>
  );
}
