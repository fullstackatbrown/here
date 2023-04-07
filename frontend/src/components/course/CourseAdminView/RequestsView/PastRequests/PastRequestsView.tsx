import { Button, Stack, Typography } from "@mui/material";
import { SwapRequest } from "model/swapRequest";
import { FC } from "react";
import PastRequest from "./PastRequestCard";
import { sortRequestsByTime } from "@util/shared/requestTime";

export interface PastRequestViewProps {
  pastRequests: SwapRequest[];
}

const PastRequestsView: FC<PastRequestViewProps> = ({ pastRequests }) => {
  return (
    <Stack direction="column">
      {sortRequestsByTime(pastRequests).map((r) => (
        <PastRequest key={`request${r.ID}`} request={r} />
      ))}
    </Stack>
  );
};

export default PastRequestsView;
