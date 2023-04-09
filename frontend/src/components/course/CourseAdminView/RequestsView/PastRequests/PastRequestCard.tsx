import { Box, Collapse, ListItemButton, Stack, TableRow, Typography, useTheme } from "@mui/material";
import { Swap } from "model/swap";
import { FC, useState } from "react";
import RequestStatusChip from "../RequestStatusChip";
import RequestInformation from "../RequestInformation";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { formatRequestTime } from "@util/shared/requestTime";
import { Assignment } from "model/assignment";
import { CourseUserData } from "model/course";
import { Section } from "model/section";

export interface PastRequestProps {
  request: Swap;
  student: CourseUserData;
  assignment?: Assignment;
  oldSection: Section;
  newSection: Section;
}

const PastRequest: FC<PastRequestProps> = ({ request, student, assignment, oldSection, newSection }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const whichSection = request.assignmentID ? "One-Time" : "Permanent";

  return (
    <>
      <Box
        sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
        p={1}
        onClick={() => setExpanded(!expanded)}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Box width={17} display="flex" alignItems="center">
            {expanded ?
              <ExpandMore sx={{ fontSize: 16 }} /> :
              <KeyboardArrowRightIcon
                sx={{ fontSize: 16, color: "text.disabled" }}
              />
            }
          </Box>
          <Typography>{`${student.displayName} - ${whichSection}`}</Typography>
          <RequestStatusChip
            status={request.status}
            style={{ marginRight: "auto" }}
          />
          <Typography color="secondary" fontSize={14}>{formatRequestTime(request)}</Typography>
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
