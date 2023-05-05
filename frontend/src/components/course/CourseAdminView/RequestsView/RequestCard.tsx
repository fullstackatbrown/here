import { ExpandMore } from "@mui/icons-material";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Collapse, IconButton, Stack, Theme, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import formatSectionInfo, { getSectionAvailableSeats } from "@util/shared/formatSectionInfo";
import { formatRequestTime } from "@util/shared/requestTime";
import { Assignment } from "model/assignment";
import { CourseUserData } from "model/course";
import { Section } from "model/section";
import { Swap, SwapStatus } from "model/swap";
import { FC, useState } from "react";
import RequestInformation from "./RequestInformation";
import StatusChip from "./RequestStatusChip";

export interface RequestCardProps {
  active: boolean;
  request: Swap;
  student: CourseUserData;
  assignment?: Assignment;
  oldSection: Section;
  newSection: Section;
  handleSwap: (request: Swap, status: SwapStatus) => void;
}

const RequestCard: FC<RequestCardProps> = ({
  active,
  request,
  student,
  assignment,
  oldSection,
  newSection,
  handleSwap,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(false);
  const theme = useTheme();
  const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const pending = request.status === SwapStatus.Pending;
  console.log(request)

  function onClickHandleSwap(status: SwapStatus) {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      handleSwap(request, status);
    };
  }

  function studentNameTrimmed() {
    if (request.studentName.length > 23 && pending) {
      return request.studentName.substring(0, 23) + ".";
    }
    return request.studentName;
  }

  function formatRequestInfo() {
    if (!student) {
      return "[No Longer Enrolled; Please Archive]"
    }

    // TODO: handle exceptionally long string
    const permanentLabel = !assignment ? "[Permanent] " : "";

    let info = `${permanentLabel}${formatSectionInfo(oldSection, true)} → ${formatSectionInfo(newSection, true)}`
    if (info.length > 72) {
      info = info.substring(0, 72) + " ...";
    }
    const overCapacityLabel = getSectionAvailableSeats(newSection, assignment?.ID) <= 0 ? " (!)" : "";

    return (
      <>
        {info}
        <Box component="span" color={theme.palette.error.main}>
          {overCapacityLabel}
        </Box>
      </>)

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
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={4} alignItems="center" py={{ xs: 1, md: 0.5 }}>
            <Stack direction="row" spacing={1} width={{ md: 200 }} alignItems="center">
              <Box width={17} display="flex" alignItems="center">
                {expanded ?
                  <ExpandMore sx={{ fontSize: 16 }} /> :
                  <KeyboardArrowRightIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                }
              </Box>
              <Typography sx={{ fontSize: 15 }}>
                {expanded ? request.studentName : studentNameTrimmed()}
              </Typography>

            </Stack>
            {!expanded && !isXsScreen && student && (
              <Typography color="secondary" sx={{ whiteSpace: "pre-line", fontSize: 14 }}>
                {formatRequestInfo()}
              </Typography>
            )}
          </Stack>
          <Box display="flex" maxWidth={110} justifyContent="flex-end">
            {(pending && (hover || expanded) && active) ? (
              <Stack direction="row" display="flex" alignItems="center" spacing={0.5}>
                <Tooltip title="approve" disableTouchListener>
                  <IconButton
                    sx={{ p: { xs: 1, md: 0.5 }, color: "inherit" }}
                    onClick={onClickHandleSwap(SwapStatus.Approved)}
                  >
                    <CheckIcon sx={{ fontSize: { xs: 20, md: 18 } }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="deny" disableTouchListener>
                  <IconButton
                    sx={{ p: { xs: 1, md: 0.5 }, color: "inherit" }}
                    onClick={onClickHandleSwap(SwapStatus.Denied)}>
                    <CloseIcon sx={{ fontSize: { xs: 20, md: 18 } }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="archive" disableTouchListener>
                  <IconButton
                    sx={{ p: { xs: 1, md: 0.5 }, color: "inherit" }}
                    onClick={onClickHandleSwap(SwapStatus.Archived)}
                  >
                    <ArchiveOutlinedIcon sx={{ fontSize: { xs: 20, md: 18 } }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            ) : (
              pending ?
                <Typography color="secondary" fontSize={14}>
                  {formatRequestTime(request.requestTime, false, pending)}
                </Typography> :
                <StatusChip status={request.status} timestamp={request.handledTime} />
            )}
          </Box>
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

export default RequestCard;
