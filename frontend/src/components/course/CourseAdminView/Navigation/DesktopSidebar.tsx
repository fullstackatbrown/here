import { Button, Divider, Stack } from "@mui/material";

interface DesktopSidebarProps {
  headerInView: boolean;
  courseCode: string;
}

export const DesktopSidebar = ({
  headerInView,
  courseCode,
  children,
}: React.PropsWithChildren<DesktopSidebarProps>) => {
  return (
    <Stack
      sx={{
        position: "fixed",
        display: {
          xs: "none",
          md: "flex",
        },
      }}
      justifyContent="center"
    >
      <Stack alignItems="start">{children}</Stack>

      {/* {!headerInView ? (
        <>
          <Divider />
          <Button
            sx={{
              flexDirection: "row",
              justifyContent: "flex-start",
              fontWeight: 400,
            }}
            color="secondary"
            variant="text"
          >
            {courseCode}
          </Button>
        </>
      ) : null} */}
    </Stack>
  );
};
