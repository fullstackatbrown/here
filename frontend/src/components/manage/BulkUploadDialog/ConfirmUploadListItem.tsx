import { ExpandMore } from "@mui/icons-material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Collapse, Stack, Typography, useTheme } from "@mui/material";
import { CoursePermission } from "model/user";
import { FC, useState } from "react";
import AccessList from "../../shared/AccessList/AccessList";
import { AddPermissionRequest } from "model/course";

interface ConfirmUploadListItemProps {
    courseCode: string;
    courseTitle: string;
    permissions: AddPermissionRequest[];
}

const ConfirmUploadListItem: FC<ConfirmUploadListItemProps> = ({ courseCode, courseTitle, permissions }) => {
    const [expanded, setExpanded] = useState(true);
    const [hover, setHover] = useState(false);
    const theme = useTheme();

    const getEmailsByPermission = (permission: CoursePermission) => {
        return permissions.filter((p) => p.permission === permission).map((p) => p.email);
    }

    return (
        <>
            <Box
                sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
                px={1}
                py={0.5}
                onClick={() => setExpanded(!expanded)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={4} alignItems="center" py={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box width={17} display="flex" alignItems="center">
                                {expanded ?
                                    <ExpandMore sx={{ fontSize: 16 }} /> :
                                    <KeyboardArrowRightIcon
                                        sx={{ fontSize: 16, color: "text.disabled" }}
                                    />
                                }
                            </Box>
                            <Typography>{courseCode}: {courseTitle}</Typography>
                        </Stack>
                    </Stack>
                </Stack >
            </Box >
            <Collapse in={expanded}>
                <Stack ml={4} mt={1} mb={2} spacing={1}>
                    <AccessList access={CoursePermission.CourseAdmin} users={[]} emails={getEmailsByPermission(CoursePermission.CourseAdmin)} />
                    <AccessList access={CoursePermission.CourseStaff} users={[]} emails={getEmailsByPermission(CoursePermission.CourseStaff)} />
                </Stack>
            </Collapse>
        </>
    )
}

export default ConfirmUploadListItem