import { Chip, styled } from "@mui/material";
import { CourseStatus } from "model/course";
import React, { FC } from "react";

export interface CourseStatusChipProps {
    status: CourseStatus;
    style?: React.CSSProperties
    size?: "small" | "medium";
}

const MyChip = styled(Chip)(({ size }) => {
    switch (size) {
        case "medium":
            return {
                height: 24,
                fontSize: 14,
                fontWeight: 500,
                '& .MuiChip-label': {
                    paddingLeft: 8,
                    paddingRight: 8,
                },
            }
        default:
            return {
                height: 18,
                fontSize: 12,
                fontWeight: 500,
                '& .MuiChip-label': {
                    paddingLeft: 6,
                    paddingRight: 6,
                },
            }
    }
});

const CourseStatusChip: FC<CourseStatusChipProps> = ({ status, style, size = "small" }) => {
    const variant = "outlined"
    switch (status) {
        case CourseStatus.CourseActive:
            return <MyChip label="active" color="primary" {...{ style, size, variant }} />;
        case CourseStatus.CourseInactive:
            return <MyChip label="inactive" color="secondary" {...{ style, size, variant }} />;
        case CourseStatus.CourseArchived:
            return <MyChip label="archived" color="secondary" {...{ style, size, variant }} />;
    }
};

export default CourseStatusChip;


