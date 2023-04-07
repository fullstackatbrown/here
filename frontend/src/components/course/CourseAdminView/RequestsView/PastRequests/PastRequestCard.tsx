import { Box, Collapse, ListItemButton, Stack, TableRow, Typography, useTheme } from "@mui/material";
import { SwapRequest } from "model/swapRequest";
import { FC, useState } from "react";
import RequestStatusChip from "../RequestStatusChip";
import RequestInformation from "../RequestInformation";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { formatRequestTime } from "@util/shared/requestTime";

export interface PastRequestProps {
  request: SwapRequest;
}

const PastRequest: FC<PastRequestProps> = ({ request }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const whichSection = request.assignmentID ? "Temporary" : "Permanent";

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
          <RequestStatusChip
            status={request.status}
            size="small"
            style={{ marginRight: "auto" }}
          />
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

export default PastRequest;
