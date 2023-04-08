import { Button, Stack, Typography } from "@mui/material";
import { Swap } from "model/swap";
import { FC } from "react";
import PendingRequest from "./PendingRequestCard";
import { sortRequestsByTime } from "@util/shared/requestTime";

export interface PendingRequestViewProps {
  pendingRequests: Swap[];
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
