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

export interface HTASectionCardProps {
  section: Section;
}

/**
 * SectionCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const HTASectionCard: FC<HTASectionCardProps> = ({ section }) => {
  const startTime = new Date(section.startTime);
  const endTime = new Date(section.endTime);
  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      {/* TODO: handle what should happen on click */}
      <ButtonBase
        onClick={() => console.log("todo...")}
        sx={{ width: "100%", textAlign: "left" }}
        focusRipple
      >
        <Box
          width="100%"
          height={125}
          p={2}
          color="#fff"
          sx={{ bgcolor: getSectionColor(section) }}
        >
          <Typography variant="h6" noWrap>
            {/* {section.course.code}: {section.course.title} */}
            {formatSectionTime(startTime, endTime)}
          </Typography>
          <Typography variant="body2" fontWeight={400}>
            {section.location}
          </Typography>
        </Box>
      </ButtonBase>
      <Box width="100%" p={2} color={"#777777"}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {`${section.capacity - section.enrollment}/${
            section.capacity
          } Available`}
        </Stack>
      </Box>
    </Paper>
  );
};

export default HTASectionCard;
