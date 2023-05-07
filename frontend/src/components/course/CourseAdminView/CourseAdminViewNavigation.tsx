import { Button, Stack, Typography, buttonClasses } from "@mui/material";
import { capitalizeWords } from "@util/shared/string";
import { usePendingSwaps } from "api/swaps/hooks";
import { View } from "model/general";
import { Swap } from "model/swap";
import { CoursePermission } from "model/user";
import { useRouter } from "next/router";
import { useMemo } from "react";

interface CourseAdminViewNavigationProps {
  access: CoursePermission;
  pendingRequests: Swap[];
}

export default function CourseAdminViewNavigation({ access, pendingRequests }: CourseAdminViewNavigationProps) {
  const router = useRouter();
  const { query } = router;

  const numPendingRequests = useMemo(() => pendingRequests?.length || 0, [pendingRequests])

  function navigateTo(view: View) {
    return router.push(`${router.query.courseID}?view=${view}`, undefined, { shallow: true });
  }

  function getNavigationButton(view: View, pendingCount?: number) {
    return (
      <Button
        key={view}
        sx={{
          flexDirection: "row",
          justifyContent: "flex-start",
          fontWeight: query.view === view ? 700 : 400,
        }}
        color={query.view === view ? "inherit" : "secondary"}
        variant="text"
        onClick={() => {
          navigateTo(view);
        }}
      >
        {capitalizeWords(view)}
        {pendingCount > 0 &&
          <Typography color="primary" sx={{ fontSize: 14, fontWeight: query.view === view ? 800 : 500 }}>
            &nbsp;&nbsp;({pendingCount})
          </Typography>
        }
      </Button >
    );
  }

  return (
    <Stack
      sx={{
        position: "fixed",
        display: {
          xs: "none",
          md: "flex",
        },
      }}
      flexDirection="row"
      alignItems="start"
    >
      <Stack direction="column" spacing={1}>
        {getNavigationButton("sections")}
        {getNavigationButton("assignments")}
        {getNavigationButton("people")}
        {pendingRequests && getNavigationButton("requests", numPendingRequests)}
        {access === CoursePermission.CourseAdmin && getNavigationButton("settings")}
      </Stack>
      {/* {open ?
                    <Tooltip title="Hide Menu" placement="right">
                        <IconButton onClick={toggleDrawer} sx={{ p: 0.5, ml: 2.5 }}>
                            <KeyboardArrowLeftIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip> :
                    <Tooltip title="Show Menu" placement="right">
                        <IconButton onClick={toggleDrawer} sx={{ p: 0.5, ml: 2.5 }}>
                            <KeyboardArrowRightIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip>} */}
    </Stack>
  )

}
