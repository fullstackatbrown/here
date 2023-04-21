import { Button, Stack } from "@mui/material";
import { capitalizeWords } from "@util/shared/string";
import { View } from "model/general";
import { useRouter } from "next/router";

interface CourseStudentViewNavigationProps {

}

export default function CourseStudentViewNavigation() {
  const router = useRouter();
  const { query } = router;

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
          navigateTo(view);
        }}
      >
        {capitalizeWords(view)}
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
        {getNavigationButton("settings")}
      </Stack>
    </Stack>
  )

}
