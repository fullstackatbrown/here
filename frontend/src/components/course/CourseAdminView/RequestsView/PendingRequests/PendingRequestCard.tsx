import { Stack, Typography } from "@mui/material";
import { SwapRequest } from "model/swapRequest";
import { FC } from "react";

export interface PendingRequestProps {
  pendingRequest: SwapRequest;
}

const PendingRequest: FC<PendingRequestProps> = ({ pendingRequest }) => {
  const whichSection = pendingRequest.assignmentID
    ? pendingRequest.newSectionID
    : "Permanent";

  return (
    <Stack direction="row">
      <Typography>{`${pendingRequest.studentID} - ${whichSection}`}</Typography>
      <Typography>{}</Typography>
    </Stack>
  );
};

export default PendingRequest;
