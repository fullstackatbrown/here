import { ExpandMore } from "@mui/icons-material";
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Collapse, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { red } from '@mui/material/colors';
import formatSectionInfo, { formatSectionCapacity } from "@util/shared/formatSectionInfo";
import { formatRequestTime } from "@util/shared/requestTime";
import { Assignment } from "model/assignment";
import { Course, CourseUserData } from "model/course";
import { Section } from "model/section";
import { Swap, SwapStatus } from "model/swap";
import { FC, useState } from "react";
import RequestInformation from "../RequestInformation";
import toast from "react-hot-toast";
import SwapAPI from "api/swaps/api";
import errors from "@util/errors";

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
  const whichSection = assignment ? "Temporary" : "Permanent";
  const [capacity, overlimit] = formatSectionCapacity(newSection, assignment?.ID);

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
        py={1}
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={4} alignItems="center" py={0.5}>
            <Stack direction="row" spacing={1} width={350} alignItems="center">
              <Box width={17} display="flex" alignItems="center">
                {expanded ?
                  <ExpandMore sx={{ fontSize: 16 }} /> :
                  <KeyboardArrowRightIcon
                    sx={{ fontSize: 16, color: "text.disabled" }}
                  />
                }
              </Box>
              {/* TODO: handle exceptionally long string */}
              <Typography>{`${student.displayName} - ${whichSection}`}</Typography>
            </Stack>
            {!expanded && <Typography color="secondary" sx={{ whiteSpace: "pre-line", fontSize: 15 }}>
              {formatSectionInfo(oldSection, true)}
              &nbsp;&nbsp;{'->'}&nbsp;&nbsp;
              {formatSectionInfo(newSection, true)}&nbsp;
              <Box component="span" color={overlimit ? red[500] : "secondary"}>{capacity}</Box>
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
