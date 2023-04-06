import { Button, Stack, Typography } from "@mui/material";
import { SwapRequest } from "model/swapRequest";
import { FC } from "react";
import PastRequest from "./PastRequestCard";

export interface PastRequestViewProps {
  pastRequests: SwapRequest[];
}

const PastRequestsView: FC<PastRequestViewProps> = ({
  pastRequests,
}) => {
  return (
    <>
      <Stack direction="column" spacing={2}>
        {pastRequests.map((r, index) => (
          <PastRequest key={index} pastRequest={r} />
        ))}
      </Stack>
    </>
  );
};

export default PastRequestsView;
