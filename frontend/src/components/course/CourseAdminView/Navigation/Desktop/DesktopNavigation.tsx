import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IconButton, Stack, Tooltip } from "@mui/material";
import { CoursePermission } from "model/user";
import { useEffect, useState } from "react";
import CourseAdminViewNavigation from "../CourseAdminViewNavigation";

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

    // useEffect(() => {
    //     if (!headerInView) {
    //         setOpen(false)
    //     } else {
    //         setOpen(true)
    //     }
    // }, [headerInView])

    return (
        <>
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
                <CourseAdminViewNavigation access={access} />
                {/* {open ?
                    <Tooltip title="Hide Menu" placement="right">
                        <IconButton onClick={toggleDrawer} sx={{ p: 0.5, ml: 2.5 }}>
                            <KeyboardArrowLeftIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip> :
                    <Tooltip title="Show Menu" placement="right">
                        <IconButton onClick={toggleDrawer} sx={{ p: 0.5, ml: 2.5 }}>
                            <KeyboardArrowRightIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip>} */}

            </Stack>
        </>
    );
}
