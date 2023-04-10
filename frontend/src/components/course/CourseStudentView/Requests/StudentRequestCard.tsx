import { ExpandMore } from "@mui/icons-material";
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Collapse, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { red } from '@mui/material/colors';
import formatSectionInfo, { formatSectionCapacity, getSectionAvailableSeats } from "@util/shared/formatSectionInfo";
import { formatRequestTime } from "@util/shared/requestTime";
import { Assignment } from "model/assignment";
import { Course, CourseUserData } from "model/course";
import { Section } from "model/section";
import { Swap, SwapStatus } from "model/swap";
import UndoIcon from '@mui/icons-material/Undo';
import EditIcon from '@mui/icons-material/Edit';
import { FC, useState } from "react";
import toast from "react-hot-toast";
import SwapAPI from "api/swaps/api";
import errors from "@util/errors";
import RequestStatusChip from "@components/course/CourseAdminView/RequestsView/RequestStatusChip";

export interface StudentRequestCardProps {
    request: Swap;
    student: CourseUserData;
    assignment?: Assignment;
    oldSection: Section;
    newSection: Section;
    pending: boolean;
    handleCancelSwap?: (request: Swap) => void;
}

const StudentRequestCard: FC<StudentRequestCardProps> = ({ request, student, assignment, oldSection, newSection, pending, handleCancelSwap }) => {
    const [expanded, setExpanded] = useState(false);
    const [hover, setHover] = useState(false);
    const theme = useTheme();
    const whichSection = assignment ? "One Time" : "Permanent";

    function onClickCancelSwap() {
        return (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            const confirmed = confirm("Are you sure you want to cancel this request?");
            if (confirmed) {
                handleCancelSwap && handleCancelSwap(request)
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
                    {/* <RequestInformation {...{ request, student, assignment, oldSection, newSection }} /> */}
                </Box>
            </Collapse>
        </>
    );
};

export default StudentRequestCard;
