import { Button, Stack, Typography, buttonClasses } from "@mui/material";
import { capitalizeFirstLetter } from "@util/shared/string";
import { usePendingSwaps } from "api/swaps/hooks";
import { View } from "model/general";
import { CoursePermission } from "model/user";
import { useRouter } from "next/router";
import { useState } from "react";

interface CourseAdminViewNavigationProps {
  access: CoursePermission;
  headerInView: boolean;
}

export default function CourseAdminViewNavigation({
  access, headerInView
}: CourseAdminViewNavigationProps) {
  const router = useRouter();
  const { query } = router;
  const [pendingRequests, _] = usePendingSwaps(query.courseID as string);
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // useEffect(() => {
  //     if (!headerInView) {
  //         setOpen(false)
  //     } else {
  //         setOpen(true)
  //     }
  // }, [headerInView])


  function navigateTo(view: View) {
    return router.push(`${router.query.courseID}?view=${view}`, undefined, { shallow: true });
  }

  function getNavigationButton(view: View, requestsLength?: number) {
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
        {capitalizeFirstLetter(view)}
        {requestsLength !== undefined && requestsLength > 0 &&
          <Typography color="primary" sx={{ fontSize: 14, fontWeight: query.view === view ? 800 : 500 }}>
            &nbsp;&nbsp;({requestsLength})
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
        transform: open ? "translate3d(0, 0, 0)" : "translate3d(-130px, 0, 0)",
        transition: "transform 0.5s ease-in-out",
      }}
      flexDirection="row"
      alignItems="start"
    >
      <Stack direction="column" spacing={1}>
        {getNavigationButton("sections")}
        {getNavigationButton("assignments")}
        {getNavigationButton("people")}
        {pendingRequests && getNavigationButton("requests", pendingRequests.length)}
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
