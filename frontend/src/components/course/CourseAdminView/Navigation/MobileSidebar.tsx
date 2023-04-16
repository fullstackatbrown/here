import IconButton from "@components/shared/IconButton";
import Logo from "@components/shared/Logo";
import { Box, Button, Divider, Drawer, Link, Stack } from "@mui/material";
import NextLink from "next/link";
import MenuIcon from "@mui/icons-material/Menu";

interface MobileSidebarProps {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  headerInView: boolean;
  courseCode: string;
}

export const MobileSidebar = ({
  open,
  openDrawer,
  closeDrawer,
  headerInView,
  courseCode,
  children,
}: React.PropsWithChildren<MobileSidebarProps>) => {
  return (
    <>
      <IconButton
        label="Menu"
        sx={{
          mr: 2,
          display: {
            position: "fixed",
            xs: "block",
            md: "none",
          },
        }}
        onClick={openDrawer}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={closeDrawer}>
        <Stack
          flexGrow="1"
          sx={{
            width: "max-content",
          }}
        >
          <Stack flexDirection="row" alignItems="center" px={4} py={2}>
            <NextLink href="/">
              <Link
                variant="h6"
                component="button"
                color="inherit"
                underline="hover"
                sx={{ display: "inline-flex", alignItems: "center" }}
              >
                <Box mr={1} width={30} height={30}>
                  <Logo />
                </Box>
                Here
              </Link>
            </NextLink>
          </Stack>

          <Divider />

          <Stack alignItems="start" px={4} flexGrow="1">
            {children}
          </Stack>

          {!headerInView ? (
            <Stack alignItems="start" px={4}>
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
            </Stack>
          ) : null}
        </Stack>
      </Drawer>
    </>
  );
};
