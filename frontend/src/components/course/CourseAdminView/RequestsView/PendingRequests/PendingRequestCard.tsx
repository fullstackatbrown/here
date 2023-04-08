import { ExpandMore } from "@mui/icons-material";
import { Box, Collapse, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import theme from "@util/theme";
import { Swap } from "model/swap";
import { FC, useState } from "react";
import RequestInformation from "../RequestInformation";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RequestStatusChip from "../RequestStatusChip";
import { formatRequestTime } from "@util/shared/requestTime";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArchiveIcon from '@mui/icons-material/Archive';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import { CourseUserData } from "model/course";
import { Assignment } from "model/assignment";

export interface PendingRequestProps {
  request: Swap;
  student: CourseUserData;
  assignment?: Assignment;
}

const PendingRequest: FC<PendingRequestProps> = ({ request, student, assignment }) => {
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(false);
  const theme = useTheme();
  const whichSection = assignment ? assignment.name : "Permanent";

  function handleRequest(action: "approve" | "deny" | "archive") {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      // TODO:
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
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1}>
            <Box width={17} mt={0.5}>
              {expanded ?
                <ExpandMore sx={{ fontSize: 16 }} /> :
                <KeyboardArrowRightIcon
                  sx={{ fontSize: 16, color: "text.disabled" }}
                />
              }
            </Box>
            <Stack direction="column" alignItems="flex-start">
              <Typography>{`${student.displayName} - ${whichSection}`}</Typography>
              <Typography color="secondary">
                todo: some more info here
              </Typography>
            </Stack>
          </Stack>

          {hover ?
            <Stack direction="row" py={0} display="flex" alignItems="center">
              <Tooltip title="approve">
                <IconButton sx={{ fontSize: "small", p: 0.8, color: "inherit" }} onClick={handleRequest("approve")}>
                  <CheckIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="deny">
                <IconButton sx={{ fontSize: "small", p: 0.8, color: "inherit" }} onClick={handleRequest("deny")}>
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="archive">
                <IconButton sx={{ fontSize: "small", p: 0.8, color: "inherit" }} onClick={handleRequest("archive")}>
                  <ArchiveOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Stack> :
            <Typography py={1} color="secondary" fontSize={14}>{formatRequestTime(request)}</Typography>
          }
        </Stack>
      </Box >
      <Collapse in={expanded}>
        <Box ml={4} mt={1} mb={2}>
          <RequestInformation request={request} />
        </Box>
      </Collapse>
    </>
  );
};

export default PendingRequest;
