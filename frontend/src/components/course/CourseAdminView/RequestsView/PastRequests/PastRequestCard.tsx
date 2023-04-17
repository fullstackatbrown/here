import { Box, Collapse, IconButton, ListItemButton, Stack, TableRow, Tooltip, Typography, useTheme } from "@mui/material";
import { Swap, SwapStatus } from "model/swap";
import { FC, useState } from "react";
import RequestStatusChip from "../RequestStatusChip";
import RequestInformation from "../RequestInformation";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { formatRequestTime } from "@util/shared/requestTime";
import { Assignment } from "model/assignment";
import { CourseUserData } from "model/course";
import { Section } from "model/section";
import UndoIcon from '@mui/icons-material/Undo';

export interface PastRequestProps {
  request: Swap;
  student: CourseUserData;
  assignment?: Assignment;
  oldSection: Section;
  newSection: Section;
  handleSwap: (request: Swap, status: SwapStatus) => void;
}

const PastRequest: FC<PastRequestProps> = ({ request, student, assignment, oldSection, newSection, handleSwap }) => {
  const [hover, setHover] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  function onClickHandleSwap(status: SwapStatus) {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const confirmed = confirm(`This request has already been ${request.status}. Are you sure you want to mark this request as pending?`);
      if (confirmed) handleSwap(request, status);
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
          <Stack direction="row" spacing={1} alignItems="center" py={0.5}>
            <Box width={17} display="flex" alignItems="center">
              {expanded ?
                <ExpandMore sx={{ fontSize: 16 }} /> :
                <KeyboardArrowRightIcon
                  sx={{ fontSize: 16, color: "text.disabled" }}
                />
              }
            </Box>
            <Typography sx={{ fontSize: 15 }}>{student?.displayName} - {assignment ? "One Time" : "Permanent"}</Typography>
            <RequestStatusChip
              status={request.status}
              style={{ marginRight: "auto" }}
            />
          </Stack>

          {hover ?
            <Stack direction="row" display="flex" alignItems="center">
              <Tooltip title="mark as pending">
                <IconButton sx={{ fontSize: "small", p: 0.5, color: "inherit" }} onClick={onClickHandleSwap("pending")}>
                  <UndoIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Stack> :
            <Typography color="secondary" fontSize={14}>{formatRequestTime(request)}</Typography>
          }
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

export default PastRequest;
