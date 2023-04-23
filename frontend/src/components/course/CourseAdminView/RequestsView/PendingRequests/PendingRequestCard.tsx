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
import RequestInformation from "../RequestInformation";

export interface PendingRequestProps {
  active: boolean;
  request: Swap;
  student: CourseUserData;
  assignment?: Assignment;
  oldSection: Section;
  newSection: Section;
  handleSwap: (request: Swap, status: SwapStatus) => void;
}

const PendingRequest: FC<PendingRequestProps> = ({
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

  function onClickHandleSwap(status: SwapStatus) {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      handleSwap(request, status);
    };
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
            <Stack direction="row" spacing={1} minWidth={{ md: 280 }} alignItems="center">
              <Box width={17} display="flex" alignItems="center">
                {expanded ? (
                  <ExpandMore sx={{ fontSize: 16 }} />
                ) : (
                  <KeyboardArrowRightIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                )}
              </Box>
              {/* TODO: handle exceptionally long string */}
              <Typography sx={{ fontSize: 15 }}>
                {request.studentName} - {assignment ? "One Time" : "Permanent"}{!student && " (no longer enrolled)"}
              </Typography>
            </Stack>
            {!expanded && !isXsScreen && student && (
              <Typography color="secondary" sx={{ whiteSpace: "pre-line", fontSize: 15 }}>
                {formatSectionInfo(oldSection, true)}
                &nbsp;&nbsp;{"→"}&nbsp;&nbsp;
                {formatSectionInfo(newSection, true)}&nbsp;
                {getSectionAvailableSeats(newSection, assignment?.ID) <= 0 && (
                  <Box component="span" color={theme.palette.error.main}>
                    (!)
                  </Box>
                )}
              </Typography>
            )}
          </Stack>
          <Box display="flex" width={80} justifyContent="flex-end">
            {(hover || expanded) && active ? (
              <Stack direction="row" display="flex" alignItems="center" spacing={{ xs: 0.5, md: 0 }}>
                <Tooltip title="approve" disableTouchListener>
                  <IconButton
                    sx={{ p: { xs: 1, md: 0.5 }, color: "inherit" }}
                    onClick={onClickHandleSwap("approved")}
                  >
                    <CheckIcon sx={{ fontSize: { xs: 20, md: 18 } }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="deny" disableTouchListener>
                  <IconButton
                    sx={{ p: { xs: 1, md: 0.5 }, color: "inherit" }}
                    onClick={onClickHandleSwap("denied")}>
                    <CloseIcon sx={{ fontSize: { xs: 20, md: 18 } }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="archive" disableTouchListener>
                  <IconButton
                    sx={{ p: { xs: 1, md: 0.5 }, color: "inherit" }}
                    onClick={onClickHandleSwap("archived")}
                  >
                    <ArchiveOutlinedIcon sx={{ fontSize: { xs: 20, md: 18 } }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            ) : (
              <Typography color="secondary" fontSize={14}>
                {formatRequestTime(request)}
              </Typography>
            )}
          </Box>
        </Stack>
      </Box >
      <Collapse in={expanded}>
        <Box ml={4} mt={1} mb={2}>
          <RequestInformation {...{ request, student, assignment, oldSection, newSection }} />
        </Box>
      </Collapse>
    </>
  );
};

export default PendingRequest;
