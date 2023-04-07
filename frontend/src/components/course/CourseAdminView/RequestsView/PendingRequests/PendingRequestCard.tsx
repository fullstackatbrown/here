import { ExpandMore } from "@mui/icons-material";
import { Box, Collapse, IconButton, Stack, Typography, useTheme } from "@mui/material";
import theme from "@util/theme";
import { SwapRequest } from "model/swapRequest";
import { FC, useState } from "react";
import RequestInformation from "../RequestInformation";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RequestStatusChip from "../RequestStatusChip";
import { formatRequestTime } from "@util/shared/requestTime";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArchiveIcon from '@mui/icons-material/Archive';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';

export interface PendingRequestProps {
  request: SwapRequest;
}

const PendingRequest: FC<PendingRequestProps> = ({ request }) => {
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(false);
  const theme = useTheme();
  const whichSection = request.assignmentID
    ? request.newSectionID
    : "Permanent";

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
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Stack direction="row" spacing={1} justifyContent="space-between">
          <Stack direction="row" spacing={4} py={1}>
            <Stack direction="row" spacing={1} width={350} >
              <Box width={17} display="flex" alignItems="center">
                {expanded ?
                  <ExpandMore sx={{ fontSize: 16 }} /> :
                  <KeyboardArrowRightIcon
                    sx={{ fontSize: 16, color: "text.disabled" }}
                  />
                }
              </Box>
              <Typography>{`${request.studentID} - ${whichSection}`}</Typography>
            </Stack>
            <Typography color="secondary">
              todo: some more info here
            </Typography>
          </Stack>

          {hover ?
            <Stack direction="row" py={0} display="flex" alignItems="center">
              <IconButton sx={{ fontSize: "small", p: 0.8, color: "inherit" }} onClick={handleRequest("approve")}>
                <CheckIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton sx={{ fontSize: "small", p: 0.8, color: "inherit" }} onClick={handleRequest("deny")}>
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton sx={{ fontSize: "small", p: 0.8, color: "inherit" }} onClick={handleRequest("archive")}>
                <ArchiveOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack> :
            <Typography py={1} color="secondary" fontSize={14}>{formatRequestTime(request)}</Typography>
          }

        </Stack >
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
