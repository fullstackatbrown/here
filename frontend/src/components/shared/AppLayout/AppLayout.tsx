import AccountMenu from "@components/shared/AccountMenu";
import Button from "@components/shared/Button";
import IconButton from "@components/shared/IconButton";
import Navbar from "@components/shared/Navbar";
import CloseIcon from "@mui/icons-material/Close";
import { Badge, Box, Container, Divider, Drawer, Stack, Toolbar, Typography } from "@mui/material";
import { useAuth, useNotifications } from "api/auth/hooks";
import Head from "next/head";
import { Router } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import NotificationsIcon from "@mui/icons-material/Notifications";

export interface AppLayoutProps {
  title?: string;
  maxWidth: "xl" | "md" | "sm" | "xs" | "lg" | false;
  loading?: boolean;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ title, maxWidth, loading, actionButton, children }) => {
  const [pageLoading, setPageLoading] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const [notificationMenu, setNotificationMenu] = useState(false);

  // useNotifications(currentUser, (a: Notification) => {
  //     toast.success(a.Title, { duration: 5000 });
  // });

  // Bind page load events to pageLoading state so loading bar is displayed on navigation.
  useEffect(() => {
    Router.events.on("routeChangeStart", () => setPageLoading(true));
    Router.events.on("routeChangeComplete", () => setPageLoading(false));
    Router.events.on("routeChangeError", () => setPageLoading(false));
  }, []);

  // Redirect user to login page if unauthenticated unless isPublic prop is true.
  if (!isAuthenticated) {
    window.location.href = "/login";
    return <></>;
  }

  const badgedNotificationIcon: JSX.Element = <NotificationsIcon />;
  // currentUser?.notifications.length === 0 ? (
  //   <NotificationsIcon />
  // ) : (
  //   <Badge badgeContent={currentUser?.notifications.length} color="primary">
  //     <NotificationsIcon />
  //   </Badge>
  // );

  const endItems = [
    <IconButton key="notifications" label="Notifications" onClick={() => setNotificationMenu(true)}>
      {badgedNotificationIcon}
    </IconButton>,
    <AccountMenu key="account" user={currentUser!} />,
  ];
  if (actionButton) {
    endItems.push(
      <Button variant="contained" key="action-button" startIcon={actionButton.icon} onClick={actionButton.onClick}>
        {actionButton.label}
      </Button>
    );

    endItems.reverse();
  }

  // const hasNotifications =
  //     currentUser?.notifications && currentUser.notifications.length > 0;

  return (
    <div>
      <Head>
        <title>{title ? `${title} | Here` : "Here"}</title>
      </Head>
      <Navbar fixed loading={loading || pageLoading} endItems={endItems} />
      <Drawer anchor={"right"} open={notificationMenu} onClose={() => setNotificationMenu(false)}>
        <Box height="100%" overflow="hidden" width={350} position="relative">
          <Toolbar>
            <Stack width="100%" direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Notifications</Typography>
              <IconButton label="Close" onClick={() => setNotificationMenu(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Toolbar>
          <Divider />
          {/* <Box maxHeight="100%" overflow="auto" pb={16}>
                        {hasNotifications ? (
                            <Stack p={2} spacing={2}>
                                {currentUser?.notifications &&
                                    currentUser.notifications.map(
                                        (notification) => (
                                            <NotificationItem
                                                key={notification.ID}
                                                notification={notification}
                                            />
                                        )
                                    )}
                            </Stack>
                        ) : (
                            <div>
                                <Typography
                                    textAlign="center"
                                    maxWidth={250}
                                    mx="auto"
                                >
                                    Notifications and announcements will appear
                                    here!
                                </Typography>
                            </div>
                        )}
                    </Box> */}
          {/* {hasNotifications && (
                        <Box position="absolute" width="100%" bottom={0}>
                            <Paper square>
                                <Stack
                                    p={2}
                                    alignSelf="end"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            AuthAPI.clearAllNotifications()
                                        }
                                    >
                                        Clear all
                                    </Button>
                                </Stack>
                            </Paper>
                        </Box>
                    )} */}
        </Box>
      </Drawer>
      <Container maxWidth={false} sx={{ marginY: 10 }}>
        {children}
      </Container>
    </div>
  );
};

export default AppLayout;
