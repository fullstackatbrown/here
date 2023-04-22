import { Feedback, Info, Logout, School, Settings, WbSunny } from "@mui/icons-material";
import {
    Avatar,
    ButtonBase,
    Divider, Fade, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Paper,
    Popper,
    Stack, Tooltip,
    Typography
} from "@mui/material";
import useThemeMode from "@util/mui/useThemeMode";
import getInitials from "@util/shared/getInitials";
import AuthAPI from "api/auth/api";
import FocusTrap from "focus-trap-react";
import { useRouter } from "next/router";
import { FC, useRef, useState } from "react";
import AboutDialog from "../AboutDialog";
import { User } from "model/user";

export interface AccountMenuProps {
    /** The current user. */
    user: User;
}

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Displays a button with the current user's picture and presents an account menu when clicked
 */
const AccountMenu: FC<AccountMenuProps> = ({ user }) => {
    const [open, setOpen] = useState(false);
    const [openAbout, setOpenAbout] = useState(false);
    const [themeMode, setThemeMode, prefersDarkMode] = useThemeMode();
    const router = useRouter();

    const id = open ? 'simple-popper' : undefined;
    const buttonRef = useRef(null);

    function handleSwitchTheme() {
        switch (themeMode) {
            case "dark":
                setThemeMode("system");
                return;
            case "light":
                setThemeMode("dark");
                return;
            case "system":
                setThemeMode(prefersDarkMode ? "light" : "dark");
                return;
        }
    }

    function handleSignOut() {
        AuthAPI.signOut()
            .then(() => window.location.href = "/login");
    }

    function handleClick(href: string) {
        setOpen(false);
        router.push(href);
    }

    return (<>
        {/* About dialog */}
        <AboutDialog open={openAbout} onClose={() => setOpenAbout(false)} />
        {/*Avatar button*/}
        <Tooltip title={`Signed in as ${user.displayName}`}>
            <ButtonBase aria-label="account menu" sx={{ borderRadius: '100%' }} ref={buttonRef}
                onClick={() => setOpen(!open)} focusRipple>
                <Avatar src={user.photoUrl}
                    imgProps={{ referrerPolicy: "no-referrer" }}
                    sx={{
                        width: 40,
                        height: 40,
                        fontSize: 16
                    }}>{getInitials(user.displayName)}</Avatar>
            </ButtonBase>
        </Tooltip>

        {/*Account menu popover*/}
        <Popper id={id} open={open} anchorEl={buttonRef.current} transition keepMounted={true}>
            {({ TransitionProps }) => (
                <Fade {...TransitionProps}>
                    <Paper elevation={5} sx={{ width: 320, m: 1, textAlign: "center" }}>
                        <FocusTrap active={open} focusTrapOptions={{
                            clickOutsideDeactivates: true,
                            onDeactivate: () => setTimeout(() => setOpen(false), 100),
                        }}>
                            <div>
                                <Stack sx={{ p: 4 }} alignItems="center">
                                    <Avatar
                                        src={user.photoUrl}
                                        imgProps={{ referrerPolicy: "no-referrer" }}
                                        sx={{
                                            width: 96,
                                            height: 96,
                                            fontSize: 36,
                                            marginBottom: 2,
                                        }}>{getInitials(user.displayName)}</Avatar>
                                    <Typography variant="h6" fontWeight={600}>
                                        {user.displayName}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {user.email}
                                    </Typography>
                                </Stack>
                                <Divider />
                                <List>
                                    <ListItem disablePadding>
                                        <ListItemButton onClick={handleSwitchTheme}>
                                            <ListItemIcon>
                                                <WbSunny />
                                            </ListItemIcon>
                                            <ListItemText primary={`Theme: ${capitalizeFirstLetter(themeMode)}`} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={() => handleClick("https://forms.gle/Ue9wQDXDuczLk7b56")}>
                                            <ListItemIcon>
                                                <Feedback />
                                            </ListItemIcon>
                                            <ListItemText primary="Send feedback" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton onClick={() => handleClick("/settings")}>
                                            <ListItemIcon>
                                                <Settings />
                                            </ListItemIcon>
                                            <ListItemText primary="Settings" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton onClick={() => handleClick("/manage")}>
                                            <ListItemIcon>
                                                <School />
                                            </ListItemIcon>
                                            <ListItemText primary="Manage Site" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton onClick={() => {
                                            setOpenAbout(true);
                                            setOpen(false);
                                        }}>
                                            <ListItemIcon>
                                                <Info />
                                            </ListItemIcon>
                                            <ListItemText primary="About" />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton onClick={handleSignOut}>
                                            <ListItemIcon>
                                                <Logout />
                                            </ListItemIcon>
                                            <ListItemText primary="Sign out" />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </div>
                        </FocusTrap>
                    </Paper>
                </Fade>
            )}
        </Popper>
    </>);
};

export default AccountMenu;