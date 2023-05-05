import RequestInformation from "@components/course/CourseAdminView/RequestsView/RequestInformation";
import StatusChip from "@components/course/CourseAdminView/RequestsView/RequestStatusChip";
import { useDialog } from "@components/shared/ConfirmDialog/ConfirmDialogProvider";
import { ExpandMore } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Collapse, Grid, IconButton, Stack, Theme, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
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
    const pending = request.status === SwapStatus.Pending;

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
                py={0.5}
                onClick={() => setExpanded(!expanded)}
                onMouseEnter={() => !isXsScreen && setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <Grid container spacing={3.5} display="flex" flexDirection="row" alignItems="center">
                    {/* Left: arrow and student name */}
                    <Grid item xs={8} md={expanded ? 10 : 3}>
                        <Box display="flex" flexDirection="row" alignItems="center" py={{ xs: 1, md: 0.5 }}>
                            {expanded ?
                                <ExpandMore sx={{ fontSize: 16 }} /> :
                                <KeyboardArrowRightIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                            }
                            <Typography sx={{ fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", ml: 1 }}>
                                {assignment ? "One Time Swap" : "Permanent Swap"}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Middle: request info, only display on hover, no display on mobile */}
                    <Grid item md={7} display={{ xs: "none", md: expanded ? "none" : "flex" }} alignItems="center">
                        <Typography color="secondary" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 14 }}>
                            {formatSectionInfo(oldSection, true)} → {formatSectionInfo(newSection, true)}
                        </Typography>
                    </Grid>

                    {/* Right: either time or the buttons */}
                    <Grid item xs={4} md={2} display="flex" justifyContent="flex-end" alignItems="center">
                        {(hover || expanded) && isCourseActive && pending ? (
                            <>
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
                            </>
                        ) : (
                            <StatusChip status={request.status} timestamp={pending ? request.requestTime : request.handledTime} />
                        )}
                    </Grid>
                </Grid>
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
