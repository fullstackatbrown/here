import { Badge, Button, Stack, buttonClasses } from "@mui/material";
import { capitalizeFirstLetter } from "@util/shared/string";
import { usePendingSwaps } from "api/swaps/hooks";
import { View } from "model/general";
import { CoursePermission } from "model/user";
import { useRouter } from "next/router";
import { useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EmailIcon from '@mui/icons-material/Email';
import ClassIcon from '@mui/icons-material/Class';

interface CourseAdminViewNavigationProps {
  access: CoursePermission;
}

export default function CourseAdminViewNavigation({
  access,
}: CourseAdminViewNavigationProps) {
  const router = useRouter();
  const { query } = router;
  const [pendingRequests, _] = usePendingSwaps(query.courseID as string);
  const [open, toggleOpen] = useState(false);

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
          '& .MuiButton-startIcon': { marginRight: 2.5 },
          [`& .${buttonClasses.startIcon} > *:nth-of-type(1)`]: {
            fontSize: "20px"
          },
        }}
        color={query.view === view ? "inherit" : "secondary"}
        variant="text"
        onClick={() => {
          toggleOpen(false);
          navigateTo(view);
        }}
      >
        {capitalizeFirstLetter(view)}
      </Button >
    );
  }

  return (
    <Stack direction="column" spacing={1}>
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
              right: 0,
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
    </Stack>
  )

}
