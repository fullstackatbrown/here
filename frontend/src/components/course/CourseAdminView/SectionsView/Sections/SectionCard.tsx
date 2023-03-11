import React, { FC } from "react";
import { Box, Card, IconButton, Paper, Stack, Typography } from "@mui/material";
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
    <Card sx={{ ':hover': { boxShadow: 2 } }} variant={"outlined"}>
      <Box display="flex" flexDirection="row" justifyContent="space-between" px={2.5} py={2} alignItems={"center"}>
        <Stack>
          <Typography variant="body1" noWrap>
            {formatSectionTime(startTime, endTime)}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ color: 'text.disabled' }}>
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
        <Stack display={"flex"} direction="row" spacing={4}>
          <div>
            <IconButton aria-label="edit">
              <CreateIcon />
            </IconButton>
            <IconButton aria-label="delete">
              <ClearIcon />
            </IconButton>
          </div>
        </Stack>
      </Box>
    </Card>
  );
};

export default SectionCard;
