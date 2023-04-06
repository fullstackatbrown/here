import { Badge, BadgeProps, Button, Stack, styled } from "@mui/material";
import { useSwapRequests } from "api/swaps/hooks";
import { View } from "model/general";
import { useRouter } from "next/router";

export default function CourseAdminViewNavigation() {
  const router = useRouter();

  const [swapRequests, _] = useSwapRequests();
  const numPendingRequests = swapRequests.filter(
    (r) => r.status === "pending"
  ).length;

  function navigateTo(view: View) {
    return () => {
      router.push(`${router.query.courseID}?view=${view}`, undefined, { shallow: true })
    }
  }

  return (
    <Stack alignItems="start">
      <Button variant="text" onClick={navigateTo("sections")}>Sections</Button>
      <Button variant="text" onClick={navigateTo("assignments")}>Assignments</Button>
      <Button variant="text" onClick={navigateTo("people")}>People</Button>
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
        <Button variant="text" onClick={navigateTo("requests")}>Requests</Button>
      </Badge>
    </Stack>
  )
}
