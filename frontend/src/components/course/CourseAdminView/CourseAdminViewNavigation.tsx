import { Badge, BadgeProps, Button, Stack, styled } from "@mui/material";
import { useSwapRequests } from "api/swaps/hooks";
import { View } from "model/general";
import { useRouter } from "next/router";

export default function CourseAdminViewNavigation() {
  const router = useRouter();
  const { query } = router;

  const [swapRequests, _] = useSwapRequests();
  const numPendingRequests = swapRequests.filter(
    (r) => r.status === "pending"
  ).length;

  function navigateTo(view: View) {
    return () => {
      router.push(`${router.query.courseID}?view=${view}`, undefined, { shallow: true })
    }
  }

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getButton(view: View) {
    return (
      <Button
        sx={{
          flexDirection: "row",
          justifyContent: "flex-start",
          fontWeight: query.view === view ? 700 : 400,
        }}
        color={query.view === view ? "inherit" : "secondary"}
        variant="text" onClick={navigateTo(view)}
      >
        {capitalizeFirstLetter(view)}
      </Button >
    )
  }

  return (
    <Stack alignItems="start">
      {getButton("sections")}
      {getButton("assignments")}
      {getButton("people")}
      <Badge
        color="primary"
        badgeContent={numPendingRequests}
        sx={{
          "& .MuiBadge-badge": {
            right: -10,
            top: "50%",
          },
        }}
      >
        {getButton("requests")}
      </Badge>
    </Stack>
  )
}
