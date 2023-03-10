import React, { FC } from "react";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import formatSectionTime from "@util/shared/formatSectionTime";
import CreateIcon from "@mui/icons-material/Create";
import ClearIcon from "@mui/icons-material/Clear";
import { Section } from "model/section";

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
              {/* Registered: {section.enrollment} */}
            </Typography>
          </Stack>
        </Stack>
        <Stack display={"flex"} direction="row" spacing={1}>
          <IconButton aria-label="edit" size="small">
            <CreateIcon />
          </IconButton>
          <IconButton aria-label="delete" size="small">
            <ClearIcon />
          </IconButton>
        </Stack>
      </Box>
    </Paper>
  );
};

export default SectionCard;
