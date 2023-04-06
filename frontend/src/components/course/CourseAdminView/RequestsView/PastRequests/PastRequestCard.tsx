import { Stack, Typography } from "@mui/material";
import { SwapRequest } from "model/swapRequest";
import { FC } from "react";
import RequestStatusChip from "../RequestStatusChip";

export interface PastRequestProps {
  pastRequest: SwapRequest;
}

const PastRequest: FC<PastRequestProps> = ({ pastRequest }) => {
  const whichSection = pastRequest.assignmentID ? "Temporary" : "Permanent";
  const requestTimeString = pastRequest.requestTime.toLocaleString("default", {
    month: "short",
    day: "2-digit",
  });

  return (
    <Stack direction="row" spacing={1}>
      <Typography>{`${pastRequest.studentID} - ${whichSection}`}</Typography>
      <RequestStatusChip
        status={pastRequest.status}
        size="small"
        style={{ marginRight: "auto" }}
      />
      <Typography>{requestTimeString}</Typography>
    </Stack>
  );
};

export default PastRequest;
