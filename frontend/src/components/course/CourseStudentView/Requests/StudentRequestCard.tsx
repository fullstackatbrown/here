import RequestInformation from "@components/course/CourseAdminView/RequestsView/RequestInformation";
import RequestStatusChip from "@components/course/CourseAdminView/RequestsView/RequestStatusChip";
import { ExpandMore } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Collapse, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import errors from "@util/errors";
import formatSectionInfo, { getSectionAvailableSeats } from "@util/shared/formatSectionInfo";
import { formatRequestTime } from "@util/shared/requestTime";
import SwapAPI from "api/swaps/api";
import { Assignment } from "model/assignment";
import { CourseUserData } from "model/course";
import { Section } from "model/section";
import { Swap } from "model/swap";
import { FC, useState } from "react";
import toast from "react-hot-toast";

export interface StudentRequestCardProps {
    request: Swap;
    courseID: string;
    student: CourseUserData;
    assignment?: Assignment;
    oldSection: Section;
    newSection: Section;
    pending: boolean;
}

const StudentRequestCard: FC<StudentRequestCardProps> = ({ request, student, courseID, assignment, oldSection, newSection, pending }) => {
    const [expanded, setExpanded] = useState(false);
    const [hover, setHover] = useState(false);
    const theme = useTheme();
    const whichSection = assignment ? "One Time" : "Permanent";

    function onClickCancelSwap() {
        return (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            const confirmed = confirm("Are you sure you want to cancel this request?");
            if (confirmed) {
                toast.promise(SwapAPI.cancelSwap(courseID, request.ID),
                    {
                        loading: "Cancelling request...",
                        success: "Request cancelled!",
                        error: errors.UNKNOWN,
                    })
            }
        };
    }

    function onClickEditSwap() {
        return (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

        };
    }

    return (
        <>
            <Box
                sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
                px={1}
                py={1}
                onClick={() => setExpanded(!expanded)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={4} alignItems="center" py={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center" py={0.5}>
                            <Box width={17} display="flex" alignItems="center">
                                {expanded ?
                                    <ExpandMore sx={{ fontSize: 16 }} /> :
                                    <KeyboardArrowRightIcon
                                        sx={{ fontSize: 16, color: "text.disabled" }}
                                    />
                                }
                            </Box>
                            <Typography>{whichSection}</Typography>
                            <RequestStatusChip
                                status={request.status}
                                style={{ marginRight: "auto" }}
                            />
                        </Stack>
                        {!expanded && <Typography color="secondary" sx={{ whiteSpace: "pre-line", fontSize: 15 }}>
                            {formatSectionInfo(oldSection, true)}
                            &nbsp;&nbsp;{'->'}&nbsp;&nbsp;
                            {formatSectionInfo(newSection, true)}&nbsp;
                            {getSectionAvailableSeats(newSection, assignment?.ID) <= 0 &&
                                <Box component="span" color={theme.palette.error.main}>(!)</Box>}
                        </Typography>
                        }
                    </Stack>
                    {hover && pending ?
                        <Stack direction="row" display="flex" alignItems="center">
                            <Tooltip title="edit">
                                <IconButton sx={{ fontSize: "small", p: 0.5, color: "inherit" }} onClick={onClickEditSwap}>
                                    <EditIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="cancel">
                                <IconButton sx={{ fontSize: "small", p: 0.5, color: "inherit" }} onClick={onClickCancelSwap}>
                                    <CloseIcon sx={{ fontSize: 18 }} />
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
