import { CoursePermission } from "model/user";
import CourseAdminViewNavigation from "../CourseAdminViewNavigation";
import { DesktopSidebar } from "../DesktopSidebar";
import { Box, Button, IconButton, Slide, Stack, SwipeableDrawer } from "@mui/material";
import { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface DesktopNavigationProps {
    access: CoursePermission;
    headerInView: boolean;
    courseCode: string;
}

export default function DesktopNavigation({
    access,
    headerInView,
    courseCode,
}: DesktopNavigationProps) {
    const [open, setOpen] = useState(true);


    const toggleDrawer = () => {
        setOpen(!open);
    };

    useEffect(() => {
        if (!headerInView) {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }, [headerInView])

    return (
        // <DesktopSidebar headerInView={headerInView} courseCode={courseCode}>
        // </DesktopSidebar>
        <>
            {/* <Slide direction="right" in={open} mountOnEnter unmountOnExit timeout={400}> */}
            <Stack
                sx={{
                    position: "fixed",
                    display: {
                        xs: "none",
                        md: "flex",
                    },
                    transform: open ? "translate3d(0, 0, 0)" : "translate3d(-150px, 0, 0)",
                    transition: "transform 0.5s ease-in-out",
                }}
                flexDirection="row"
                alignItems="start"
            >
                <CourseAdminViewNavigation access={access} />
                {open ?
                    <IconButton onClick={toggleDrawer} sx={{ p: 0.5, ml: 4 }}>
                        <KeyboardArrowLeftIcon sx={{ fontSize: 20 }} />
                    </IconButton> :
                    <IconButton onClick={toggleDrawer} sx={{ p: 0.5, ml: 4 }}>
                        <KeyboardArrowRightIcon sx={{ fontSize: 20 }} />
                    </IconButton>}

            </Stack>
            {/* </Slide> */}
            {/* <Stack
                sx={{
                    position: "fixed",
                    display: {
                        xs: "none",
                        md: "flex",
                    },
                }}
            >
                <IconButton onClick={toggleDrawer} sx={{ p: 0.5, display: open && "none" }}>
                    <KeyboardArrowRightIcon sx={{ fontSize: 20 }} />
                </IconButton>

            </Stack> */}
        </>


    );
}
