import { ExpandMore } from "@mui/icons-material";
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Collapse, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import formatSectionInfo, { getSectionAvailableSeats } from "@util/shared/formatSectionInfo";
import { formatRequestTime } from "@util/shared/requestTime";
import { Assignment } from "model/assignment";
import { CourseUserData } from "model/course";
import { Section } from "model/section";
import { Swap, SwapStatus } from "model/swap";
import { FC, useState } from "react";
import RequestInformation from "../RequestInformation";

export interface PendingRequestProps {
  request: Swap;
  student: CourseUserData;
  assignment?: Assignment;
  oldSection: Section;
  newSection: Section;
  handleSwap: (request: Swap, status: SwapStatus) => void;

}

const PendingRequest: FC<PendingRequestProps> = ({ request, student, assignment, oldSection, newSection, handleSwap }) => {
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(false);
  const theme = useTheme();

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
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={4} alignItems="center" py={0.5}>
            <Stack direction="row" spacing={1} width={320} alignItems="center">
              <Box width={17} display="flex" alignItems="center">
                {expanded ?
                  <ExpandMore sx={{ fontSize: 16 }} /> :
                  <KeyboardArrowRightIcon
                    sx={{ fontSize: 16, color: "text.disabled" }}
                  />
                }
              </Box>
              {/* TODO: handle exceptionally long string */}
              {/* TODO: get student name */}
              <Typography sx={{ fontSize: 15 }}>{student?.displayName} - {assignment ? "One Time" : "Permanent"}</Typography>
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
          {hover ?
            <Stack direction="row" display="flex" alignItems="center">
              <Tooltip title="approve">
                <IconButton sx={{ fontSize: "small", p: 0.5, color: "inherit" }} onClick={onClickHandleSwap("approved")}>
                  <CheckIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="deny">
                <IconButton sx={{ fontSize: "small", p: 0.5, color: "inherit" }} onClick={onClickHandleSwap("denied")}>
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="archive">
                <IconButton sx={{ fontSize: "small", p: 0.5, color: "inherit" }} onClick={onClickHandleSwap("archived")}>
                  <ArchiveOutlinedIcon sx={{ fontSize: 18 }} />
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

export default PendingRequest;
