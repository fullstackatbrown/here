import { Button, Stack, Typography } from "@mui/material";
import { SwapRequest } from "model/swapRequest";
import { FC } from "react";
import PendingRequest from "./PendingRequestCard";
import { sortRequestsByTime } from "@util/shared/requestTime";

export interface PendingRequestViewProps {
  pendingRequests: SwapRequest[];
}

const PendingRequestsView: FC<PendingRequestViewProps> = ({
  pendingRequests,
}) => {
  return (
    <Stack direction="column">
      {sortRequestsByTime(pendingRequests).map((r) => (
        <PendingRequest key={`request${r.ID}`} request={r} />
      ))}
    </Stack>
  );
};

export default PendingRequestsView;
