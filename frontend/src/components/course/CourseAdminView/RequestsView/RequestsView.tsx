import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import { Course } from "model/course";
import PendingRequestsView from "./PendingRequests/PendingRequestsView";
import PastRequestsView from "./PastRequests/PastRequestsView";
import { ExpandMore } from "@mui/icons-material";
import { useSwapRequests } from "api/swaps/hooks";

export interface RequestsViewProps {
  course: Course;
}

export default function RequestsView({ course }: RequestsViewProps) {
  const [swapRequests, _] = useSwapRequests();
  const pendingSwapRequests = swapRequests.filter(
    (r) => r.status === "pending"
  );
  const pastSwapRequests = swapRequests.filter((r) => r.status !== "pending");

  return (
    <>
      <Stack>
        <Accordion square style={{ paddingBottom: "20px", backgroundImage: "none" }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Pending Requests</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PendingRequestsView pendingRequests={pendingSwapRequests} />
          </AccordionDetails>
        </Accordion>
        <Accordion square style={{ backgroundImage: "none" }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Past Requests</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PastRequestsView pastRequests={pastSwapRequests} />
          </AccordionDetails>
        </Accordion>
      </Stack>
    </>
  );
}
