import { Badge, BadgeProps, Button, Stack, styled } from "@mui/material";
import { useSwapRequests } from "@util/swaps/hooks";
import { Views } from "model/general";

export interface CourseAdminViewNavigationProps {
  setView: (view: Views) => void;
}

export default function CourseAdminViewNavigation(
  props: CourseAdminViewNavigationProps
) {
  const [swapRequests, _] = useSwapRequests();
  const numPendingRequests = swapRequests.filter(
    (r) => r.status === "pending"
  ).length;

  return (
    <Stack alignItems="start">
      <Button variant="text" onClick={() => props.setView("sections")}>
        Sections
      </Button>
      <Button variant="text" onClick={() => props.setView("assignments")}>
        Assignments
      </Button>
      <Button variant="text" onClick={() => props.setView("people")}>
        People
      </Button>
      <Badge
        color="secondary"
        badgeContent={numPendingRequests}
        sx={{
          "& .MuiBadge-badge": {
            right: -8,
            top: "50%",
          },
        }}
      >
        <Button variant="text" onClick={() => props.setView("requests")}>
          Requests
        </Button>
      </Badge>
    </Stack>
  );
}
