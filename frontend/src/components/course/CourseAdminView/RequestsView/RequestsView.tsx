import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from "@mui/material";
import { useSwapRequests } from "@util/swaps/hooks";
import { Course } from "model/course";
<<<<<<< HEAD
import PendingRequestsView from "./PendingRequests/PendingRequestsView";
=======
import RequestStatusChip from "./RequestStatusChip";
>>>>>>> 61be9814ab2adf73e390765cfecd982a38e3be0a

export interface RequestsViewProps {
  course: Course;
}

export default function RequestsView({ course }: RequestsViewProps) {

  const [swapRequests, _] = useSwapRequests();
  const pendingSwapRequests = swapRequests.filter(r => r.status === "pending");
  const pastSwapRequests = swapRequests.filter(r => r.status !== "pending");

  return (
    <>
     {/* <Stack direction="row" justifyContent="space-between">
        <RequestStatusChip status="approved" size="small" />
        <RequestStatusChip status="denied" size="small" />
        <RequestStatusChip status="archived" size="small" />
        <RequestStatusChip status="cancelled" size="small" />
      </Stack> */}
      <Stack>
        <Accordion>
          <AccordionSummary>
            <Typography variant="h6">
              Pending Requests
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              <PendingRequestsView pendingRequests={pendingSwapRequests} />
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </>
  );
}
