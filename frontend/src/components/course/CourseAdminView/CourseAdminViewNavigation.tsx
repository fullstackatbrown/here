import { Badge, Button } from "@mui/material";
import { capitalizeFirstLetter } from "@util/shared/string";
import { usePendingSwaps } from "api/swaps/hooks";
import { View } from "model/general";
import { CoursePermission } from "model/user";
import { useRouter } from "next/router";
import { useState } from "react";
import { MobileSidebar } from "./MobileSidebar";
import { DesktopSidebar } from "./DesktopSidebar";

interface CourseAdminViewNavigationProps {
  access: CoursePermission;
  headerInView: boolean;
  courseCode: string;
}

export default function CourseAdminViewNavigation({
  access,
  headerInView,
  courseCode,
}: CourseAdminViewNavigationProps) {
  const router = useRouter();
  const { query } = router;
  const [pendingRequests, _] = usePendingSwaps(query.courseID as string);
  const [open, toggleOpen] = useState(false);

  function navigateTo(view: View) {
    return router.push(`${router.query.courseID}?view=${view}`, undefined, { shallow: true });
  }

  function getNavigationButton(view: View) {
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
          toggleOpen(false);
          navigateTo(view);
        }}
      >
        {capitalizeFirstLetter(view)}
      </Button>
    );
  }

  function getSidebarItems() {
    return (
      <>
        {getNavigationButton("sections")}
        {getNavigationButton("assignments")}
        {getNavigationButton("people")}
        {pendingRequests && pendingRequests.length > 0 ? (
          <Badge
            key="request-badge"
            color="primary"
            badgeContent={pendingRequests.length}
            sx={{
              "& .MuiBadge-badge": {
                right: -10,
                top: "50%",
              },
            }}
          >
            {getNavigationButton("requests")}
          </Badge>
        ) : (
          getNavigationButton("requests")
        )}
        {access === CoursePermission.CourseAdmin && getNavigationButton("settings")}
      </>
    );
  }

  return (
    <>
      <MobileSidebar
        open={open}
        openDrawer={() => toggleOpen(true)}
        closeDrawer={() => toggleOpen(false)}
        headerInView={headerInView}
        courseCode={courseCode}
      >
        {getSidebarItems()}
      </MobileSidebar>
      <DesktopSidebar headerInView={headerInView} courseCode={courseCode}>
        {getSidebarItems()}
      </DesktopSidebar>
    </>
  );
}
