import { Stack, Typography } from "@mui/material";
import formatSectionTime from "@util/shared/formatSectionTime";
import { SwapRequest } from "model/swapRequest";
import { FC } from "react";
import RequestStatusChip from "../RequestStatusChip";

export interface PastRequestProps {
  pastRequest: SwapRequest;
}

const PastRequest: FC<PastRequestProps> = ({ pastRequest }) => {
  const whichSection = pastRequest.assignmentID ? "Temporary" : "Permanent";

  return (
    <Stack direction="row">
      <Typography>{`${pastRequest.studentID} - ${whichSection}`}</Typography>
      <RequestStatusChip status={pastRequest.status} size="small" />
    </Stack>
  );
};

export default PastRequest;
