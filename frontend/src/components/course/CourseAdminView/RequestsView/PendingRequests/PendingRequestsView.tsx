import { Button, Stack, Typography } from "@mui/material";
import { SwapRequest } from "model/swapRequest";
import { FC } from "react";
import PendingRequest from "./PendingRequestCard";

export interface PendingRequestViewProps {
  pendingRequests: SwapRequest[];
}

const PendingRequestsView: FC<PendingRequestViewProps> = ({
  pendingRequests,
}) => {
  return (
    <>
      <Stack direction="column" justifyContent="space-between" mb={1}>
        {pendingRequests.map((r, index) => (
          <PendingRequest key={index} pendingRequest={r} />
        ))}
      </Stack>
    </>
  );
};

export default PendingRequestsView;
