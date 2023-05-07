import { ExpandMore } from "@mui/icons-material";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Collapse, Grid, IconButton, Stack, Theme, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import formatSectionInfo, { getSectionAvailableSeats } from "@util/shared/section";
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

  function onClickHandleSwap(status: SwapStatus) {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      handleSwap(request, status);
    };
  }

  function formatRequestInfo() {
    if (!student) {
      return "[No Longer Enrolled; Please Archive]"
    }

    const permanentLabel = !assignment ? "[Permanent] " : "";
    let info = `${permanentLabel}${formatSectionInfo(oldSection, true)} → ${formatSectionInfo(newSection, true)}`
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
        <Grid container spacing={3.5} display="flex" flexDirection="row" alignItems="center">
          {/* Left: arrow and student name */}
          <Grid item xs={8} md={expanded ? 10.2 : 3}>
            <Box display="flex" flexDirection="row" alignItems="center" py={{ xs: 1, md: 0.5 }}>
              {expanded ?
                <ExpandMore sx={{ fontSize: 16 }} /> :
                <KeyboardArrowRightIcon sx={{ fontSize: 16, color: "text.disabled" }} />
              }
              <Typography sx={{ fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", ml: 1 }}>
                {request.studentName}
              </Typography>
            </Box>
          </Grid>

          {/* Middle: request info, only display on hover, no display on mobile */}
          <Grid item md={7.2} display={{ xs: "none", md: expanded ? "none" : "flex" }} alignItems="center">
            <Typography color="secondary" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 14 }}>
              {formatRequestInfo()}
            </Typography>
          </Grid>

          {/* Right: either time or the buttons */}
          <Grid item xs={4} md={1.8} display="flex" justifyContent="flex-end" alignItems="center">
            {(pending && (hover || expanded) && active) ? (
              <>
                <Tooltip title="approve" disableTouchListener>
                  <IconButton
                    sx={{ p: { xs: 1, md: 0.5 }, color: "inherit", mr: 0.5 }}
                    onClick={onClickHandleSwap(SwapStatus.Approved)}
                  >
                    <CheckIcon sx={{ fontSize: { xs: 20, md: 18 } }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="deny" disableTouchListener>
                  <IconButton
                    sx={{ p: { xs: 1, md: 0.5 }, color: "inherit", mr: 0.5 }}
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
              </>
            ) : (
              pending ?
                <Typography color="secondary" fontSize={14}>
                  {formatRequestTime(request.requestTime, false, pending)}
                </Typography> :
                <StatusChip status={request.status} timestamp={request.handledTime} />
            )}
          </Grid>
        </Grid>
      </Box >

      {/* Info that is displayed on click */}
      < Collapse in={expanded}>
        <Box ml={4} mt={1} mb={2}>
          <RequestInformation {...{ request, student, assignment, oldSection, newSection }} />
        </Box>
      </Collapse >
    </>
  );
};

export default RequestCard;
