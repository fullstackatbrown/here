import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from "@mui/material";
import { useSwapRequests } from "@util/swaps/hooks";
import { Course } from "model/course";
import PendingRequestsView from "./PendingRequests/PendingRequestsView";

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
