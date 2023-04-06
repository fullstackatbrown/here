import React, { FC } from "react";
import { Section } from "api/section/api";
import { Chip } from "@mui/material";

export interface SectionStatusChipProps {
    section: Section;
    size?: "small" | "medium";
}

const SectionStatusChip: FC<SectionStatusChipProps> = ({ section: section, size }) => {
    if (section.endTime < new Date()) {
        return <Chip label="Ended" size={size} color="error" sx={{ fontWeight: 600 }} />;
    } else if (section.startTime > new Date()) {
        return <Chip label="Upcoming" size={size} color="info" sx={{ fontWeight: 600 }} />;
    } else {
        return <Chip label="Active" size={size} color="success" sx={{ fontWeight: 600 }} />;
    }
};

export default SectionStatusChip;


