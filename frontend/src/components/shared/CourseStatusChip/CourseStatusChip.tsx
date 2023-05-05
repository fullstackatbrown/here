import { CourseStatus } from "model/course";
import React, { FC } from "react";
import MyChip from "../MyChip/MyChip";

export interface CourseStatusChipProps {
    status: CourseStatus;
    style?: React.CSSProperties
    size?: "small" | "medium";
}

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


