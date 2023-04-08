import { Button, Stack, Typography } from "@mui/material";
import { Swap } from "model/swap";
import { FC } from "react";
import PastRequest from "./PastRequestCard";
import { sortRequestsByTime } from "@util/shared/requestTime";

export interface PastRequestViewProps {
  pastRequests: Swap[];
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
