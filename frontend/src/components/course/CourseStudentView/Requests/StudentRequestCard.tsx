import RequestInformation from "@components/course/CourseAdminView/RequestsView/RequestInformation";
import RequestStatusChip from "@components/course/CourseAdminView/RequestsView/RequestStatusChip";
import { useDialog } from "@components/shared/ConfirmDialog/ConfirmDialogProvider";
import { ExpandMore } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Collapse, IconButton, Stack, Theme, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import formatSectionInfo, { getSectionAvailableSeats } from "@util/shared/formatSectionInfo";
import { formatRequestTime } from "@util/shared/requestTime";
import SwapAPI from "api/swaps/api";
import { Assignment } from "model/assignment";
import { Course, CourseStatus, CourseUserData } from "model/course";
import { Section } from "model/section";
import { Swap, SwapStatus } from "model/swap";
import { FC, useState } from "react";
import toast from "react-hot-toast";

export interface StudentRequestCardProps {
    request: Swap;
    course: Course;
    student: CourseUserData;
    assignment?: Assignment;
    oldSection: Section;
    newSection: Section;
    handleOpenSwapRequestDialog: (swap: Swap) => void;
}

const StudentRequestCard: FC<StudentRequestCardProps> = ({ request, student, course, assignment, oldSection, newSection, handleOpenSwapRequestDialog }) => {
    const [expanded, setExpanded] = useState(false);
    const [hover, setHover] = useState(false);
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const isCourseActive = course.status === CourseStatus.CourseActive

    const showDialog = useDialog();
    const theme = useTheme();

    const onClickCancelSwap = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const confirmed = await showDialog({
            title: "Cancel Swap Request",
            message: "Are you sure you want to cancel this request? This action cannot be undone.",
        })
        if (confirmed) {
            toast.promise(SwapAPI.cancelSwap(course.ID, request.ID),
                {
                    loading: "Cancelling request...",
                    success: "Request cancelled!",
                    error: (err) => handleBadRequestError(err)
                })
        }
    }

    function onClickEditSwap(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        handleOpenSwapRequestDialog(request);
    }

    return (
        <>
            <Box
                sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
                px={1}
                py={0.3}
                onClick={() => setExpanded(!expanded)}
                onMouseEnter={() => !isXsScreen && setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" py={{ xs: 1, md: 0.5 }} >
                        <Stack direction="row" spacing={1} alignItems="center" py={0.5} width={280}>
                            <Box width={17} display="flex" alignItems="center">
                                {expanded ?
                                    <ExpandMore sx={{ fontSize: 16 }} /> :
                                    <KeyboardArrowRightIcon
                                        sx={{ fontSize: 16, color: "text.disabled" }}
                                    />
                                }
                            </Box>
                            <Typography sx={{ fontSize: 14 }}>{assignment ? "One Time Swap" : "Permanent Swap"}</Typography>
                            <RequestStatusChip
                                status={request.status}
                                style={{ marginRight: "auto" }}
                            />
                        </Stack>
                        {!expanded && !isXsScreen &&
                            <Typography color="secondary" sx={{ whiteSpace: "pre-line", fontSize: 14 }}>
                                {formatSectionInfo(oldSection, true)}
                                &nbsp;&nbsp;{'->'}&nbsp;&nbsp;
                                {formatSectionInfo(newSection, true)}&nbsp;
                                {getSectionAvailableSeats(newSection, assignment?.ID) <= 0 &&
                                    <Box component="span" color={theme.palette.error.main}>(!)</Box>}
                            </Typography>
                        }
                    </Stack>
                    {(hover || expanded) && isCourseActive && request.status === SwapStatus.Pending ?
                        <Stack direction="row" display="flex" alignItems="center">
                            <Tooltip title="edit">
                                <IconButton sx={{ p: { xs: 1, md: 0.5 }, color: "inherit" }} onClick={onClickEditSwap}>
                                    <EditIcon sx={{ fontSize: { xs: 20, md: 18 } }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="cancel">
                                <IconButton sx={{ p: { xs: 1, md: 0.5 }, color: "inherit" }} onClick={onClickCancelSwap}>
                                    <CloseIcon sx={{ fontSize: { xs: 20, md: 18 } }} />
                                </IconButton>
                            </Tooltip>
                        </Stack> :
                        <Typography color="secondary" fontSize={14}>{formatRequestTime(request)}</Typography>
                    }
                </Stack >
            </Box >
            <Collapse in={expanded}>
                <Box ml={4} mt={1} mb={2}>
                    <RequestInformation {...{ request, student, assignment, oldSection, newSection }} />
                </Box>
            </Collapse>
        </>
    );
};

export default StudentRequestCard;
