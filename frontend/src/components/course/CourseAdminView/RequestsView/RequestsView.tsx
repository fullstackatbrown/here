import { Stack } from "@mui/material";
import { Course } from "model/course";
import RequestStatusChip from "./RequestStatusChip";

export interface RequestsViewProps {
  course: Course;
}

export default function RequestsView({ course }: RequestsViewProps) {
  return (
    <Stack>
      <div>Requests View</div>

      <Stack direction="row" justifyContent="space-between">
        <RequestStatusChip status="approved" size="small" />
        <RequestStatusChip status="denied" size="small" />
        <RequestStatusChip status="archived" size="small" />
        <RequestStatusChip status="cancelled" size="small" />
      </Stack>
    </Stack>
  );
}