import React, { FC } from "react";
import { Box, ButtonBase, Paper, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useRouter } from "next/router";
import { Section } from "@util/section/api";
import formatEndTime from "@util/shared/formatEndTime";
import getSectionColor from "@util/shared/getSectionColor";
import SectionStatusChip from "@components/course/CourseStatusChip";
import formatSectionTime from "@util/shared/formatSectionTime";
import CreateIcon from "@mui/icons-material/Create";
import ClearIcon from "@mui/icons-material/Clear";

export interface SectionCardProps {
  section: Section;
}

/**
 * SectionCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const SectionCard: FC<SectionCardProps> = ({ section }) => {
  const startTime = new Date(section.startTime);
  const endTime = new Date(section.endTime);
  return (
    <Paper
      variant="elevation"
      elevation={1}
      style={{
        padding: 16,
      }}
      square
    >
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Stack>
          <Typography variant="body1" noWrap>
            {formatSectionTime(startTime, endTime)}
          </Typography>
          {/* TODO: change color to an RGB or HSL value */}
          <Stack direction="row" spacing={2} color="lightgray">
            <Typography variant="body1" fontWeight={400}>
              Location: {section.location}
            </Typography>
            <Typography variant="body1" fontWeight={400}>
              Capacity: {section.capacity}
            </Typography>
            <Typography variant="body1" fontWeight={400}>
              Registered: {section.enrollment}
            </Typography>
          </Stack>
        </Stack>
        <Stack display={"flex"} direction="row" spacing={1}>
          <ButtonBase
            onClick={() => console.log("handle editing section...")}
            focusRipple
          >
            <CreateIcon />
          </ButtonBase>
          <ButtonBase
            onClick={() => console.log("handle deleting section...")}
            focusRipple
          >
            <ClearIcon />
          </ButtonBase>
        </Stack>
      </Box>
    </Paper>
  );
};

export default SectionCard;
