import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Stack
} from "@mui/material";
import { useSwapRequests } from "api/swaps/hooks";
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

  const [swapRequests, _] = useSwapRequests();
  const pendingSwapRequests = swapRequests.filter(
    (r) => r.status === "pending"
  );
  const pastSwapRequests = swapRequests.filter((r) => r.status !== "pending");

  return (
    <Stack spacing={2} ml={-1} mt={-1}>
      <Stack direction="row" justifyContent="space-between">
        <Button
          color="inherit" variant="text" sx={{ fontSize: 17 }}
          startIcon={pendingRequestsOpen ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setPendingRequestsOpen(!pendingRequestsOpen)}
        >
          Pending Requests
        </Button>
      </Stack>
      <Collapse in={pendingRequestsOpen} timeout="auto" unmountOnExit>
        <Box ml={4}>
          <PendingRequestsView pendingRequests={pendingSwapRequests} />
        </Box>
      </Collapse>

      <Stack direction="row" justifyContent="space-between">
        <Button
          color="inherit" variant="text" sx={{ fontSize: 17 }}
          startIcon={pendingRequestsOpen ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setPastRequestsOpen(!pastRequestsOpen)}
        >
          Past Requests
        </Button>
      </Stack>
      <Collapse in={pastRequestsOpen} timeout="auto" unmountOnExit>
        <Box ml={4}>
          <PastRequestsView pastRequests={pastSwapRequests} />
        </Box>
      </Collapse>
    </Stack >
  );
}
