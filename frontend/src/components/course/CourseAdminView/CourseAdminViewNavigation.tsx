import { Badge, BadgeProps, Button, Stack, styled } from "@mui/material";
import { useSwaps } from "api/swaps/hooks";
import { View } from "model/general";
import { useRouter } from "next/router";

export default function CourseAdminViewNavigation() {
  const router = useRouter();
  const { query } = router;

  const [swapRequests, _] = useSwaps("a");
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

  function getNavigationButton(view: View) {
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
      {getNavigationButton("sections")}
      {getNavigationButton("assignments")}
      {getNavigationButton("people")}
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
        {getNavigationButton("requests")}
      </Badge>
    </Stack>
  )
}
