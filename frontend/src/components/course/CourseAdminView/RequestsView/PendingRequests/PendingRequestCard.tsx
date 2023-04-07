import { ExpandMore } from "@mui/icons-material";
import { Box, Collapse, Stack, Typography, useTheme } from "@mui/material";
import theme from "@util/theme";
import { SwapRequest } from "model/swapRequest";
import { FC, useState } from "react";
import RequestInformation from "../RequestInformation";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RequestStatusChip from "../RequestStatusChip";
import { formatRequestTime } from "@util/shared/requestTime";

export interface PendingRequestProps {
  request: SwapRequest;
}

const PendingRequest: FC<PendingRequestProps> = ({ request }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const whichSection = request.assignmentID
    ? request.newSectionID
    : "Permanent";

  return (
    <>
      <Box
        sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
        p={1}
        onClick={() => setExpanded(!expanded)}
      >
        <Stack direction="row" spacing={1}>
          <Box width={17} display="flex" alignItems="center">
            {expanded ?
              <ExpandMore sx={{ fontSize: 16 }} /> :
              <KeyboardArrowRightIcon
                sx={{ fontSize: 16, color: "text.disabled" }}
              />
            }
          </Box>
          <Typography>{`${request.studentID} - ${whichSection}`}</Typography>
          <Typography color="secondary" fontSize={14}>{formatRequestTime(request)}</Typography>
        </Stack>
      </Box>
      <Collapse in={expanded}>
        <Box ml={4} mt={1} mb={2}>
          <RequestInformation request={request} />
        </Box>
      </Collapse>
    </>
  );
};

export default PendingRequest;
