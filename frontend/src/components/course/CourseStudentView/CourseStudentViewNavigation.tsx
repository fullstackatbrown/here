import { Button, Stack, Typography } from "@mui/material";
import { capitalizeWords } from "@util/shared/string";
import { View } from "model/general";
import { Survey } from "model/survey";
import { User } from "model/user";
import { useRouter } from "next/router";
import { useMemo } from "react";

interface CourseStudentViewNavigationProps {
  surveys: Survey[];
  student: User;
}

export default function CourseStudentViewNavigation({ surveys, student }: CourseStudentViewNavigationProps) {
  const router = useRouter();
  const { query } = router;

  const numPendingSurvey = useMemo(() => {
    // published, didn't fill out, has not ended
    console.log(surveys)
    console.log(surveys.filter(s => s.published && !(s.responses?.[student.ID]) && new Date(s.endTime) > new Date()))
    return surveys.filter(s => s.published && !(s.responses?.[student.ID]) && new Date(s.endTime) > new Date()).length
  }, [surveys, student])

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
        transform: open ? "translate3d(0, 0, 0)" : "translate3d(-130px, 0, 0)",
        transition: "transform 0.5s ease-in-out",
      }}
      flexDirection="row"
      alignItems="start"
    >
      <Stack direction="column" spacing={1}>
        {getNavigationButton("home")}
        {getNavigationButton("my requests")}
        {getNavigationButton("surveys", numPendingSurvey)}
        {getNavigationButton("settings")}
      </Stack>
    </Stack>
  )

}