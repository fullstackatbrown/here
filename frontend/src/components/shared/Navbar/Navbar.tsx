import Logo from "@components/shared/Logo";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Divider, IconButton, LinearProgress, Link, Stack, Toolbar, Tooltip } from "@mui/material";
import NextLink from "next/link";
import { FC, useEffect, useState } from "react";

export interface NavbarProps {
    /** Displays a menu button on the leading edge of the navbar. */
    showMenuButton?: boolean;
    /** A function that's called when the menu button is clicked. */
    onOpenMenu?: () => any;
    /** Displays a thinner navbar. */
    compact?: boolean;
    /** Items to display on the leading side of the header. */
    startItems?: JSX.Element[];
    /** Items to display on the trailing side of the header. */
    endItems?: JSX.Element[];
    /** Displays a loading indicator above the navbar. */
    loading?: boolean;
    /** Enables fixed positioning on the navbar **/
    fixed?: boolean;
}

/**
 * A header that displays information and actions relating to the current page.
 */
const Navbar: FC<NavbarProps> = ({
    compact,
    endItems,
    loading = false,
    onOpenMenu,
    showMenuButton,
    startItems,
    fixed
}) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
        const position = window.scrollY;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return <Box sx={{ flexGrow: 1, position: "relative" }}>
        <AppBar position={fixed ? "fixed" : "static"} color="transparent" elevation={scrollPosition > 20 ? 2 : 0}>
            {loading && <LinearProgress sx={{ position: "absolute", bottom: 0, width: "100%", height: 2 }} />}
            <Box sx={(theme) => ({ backgroundColor: theme.palette.background.default })}>
                <Toolbar variant={compact ? "dense" : "regular"} >
                    {showMenuButton &&
                        <Tooltip title="Main Menu">
                            <IconButton
                                onClick={onOpenMenu}
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}>
                                <MenuIcon />
                            </IconButton>
                        </Tooltip>
                    }
                    <Stack sx={{ flexGrow: 1 }} direction="row" alignItems="center" spacing={1}>
                        <NextLink href="/">
                            <Link variant="h6" component="button" color="inherit" underline="hover"
                                sx={{ display: "inline-flex", alignItems: "center" }}>
                                <Box mr={1} width={30} height={30}>
                                    <Logo />
                                </Box>
                                Here
                            </Link>
                        </NextLink>
                        {startItems}
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        {endItems}
                    </Stack>
                </Toolbar>
                <Divider />
            </Box>
        </AppBar>
    </Box>;
};

export default Navbar;


