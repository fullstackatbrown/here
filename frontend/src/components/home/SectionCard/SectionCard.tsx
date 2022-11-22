import React, { FC } from "react";
import { Box, ButtonBase, Paper, Stack, Typography } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useRouter } from "next/router";
import { Section } from "@util/section/api";
import formatEndTime from "@util/shared/formatEndTime";
import getSectionColor from "@util/shared/getSectionColor";
import SectionStatusChip from "@components/course/CourseStatusChip";

export interface SectionCardProps {
    section: Section;
}

/**
 * SectionCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const SectionCard: FC<SectionCardProps> = ({ section }) => {
    const router = useRouter();

    return <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <ButtonBase onClick={() => router.push('/section/' + section.id)} sx={{ width: "100%", textAlign: "left" }}
            focusRipple>
            <Box width="100%" height={125} p={2} color="#fff" sx={{ bgcolor: getSectionColor(section) }}>
                <Typography variant="body1" noWrap>
                    {section.course.code}: {section.course.title}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                    {section.title}
                </Typography>
            </Box>
        </ButtonBase>
        <Box width="100%" p={2} color={"#777777"}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeIcon />
                        <Typography variant="body2" noWrap>
                            {formatEndTime(section.endTime)}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <LocationOnIcon />
                        <Typography variant="body2" noWrap
                            style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: '8rem' }}>
                            {section.location}
                        </Typography>
                    </Stack>
                </Stack>
                <SectionStatusChip section={section} size="small" />
            </Stack>
        </Box>
    </Paper>;
};

export default SectionCard;


