import React, { FC } from "react";
import { Chip } from "@mui/material";
import { Course } from "model/course";
import { CoursePermission } from "api/auth/api";

export interface UserAccessChipProps {
    access: CoursePermission;
    size?: "small" | "medium";
}

const QueueStatusChip: FC<UserAccessChipProps> = ({ access, size }) => {
    switch (access) {
        case CoursePermission.CourseAdmin:
            return <Chip label="Admin" size={size} color="primary" sx={{ fontWeight: 600 }} />;
        case CoursePermission.CourseStaff:
            return <Chip label="Staff" size={size} color="primary" sx={{ fontWeight: 600 }} />;
        case CoursePermission.CourseStudent:
            return <Chip label="Student" size={size} color="success" sx={{ fontWeight: 600 }} />;
        default:
            return <Chip label="Student" size={size} color="success" sx={{ fontWeight: 600 }} />;
    }
};

export default QueueStatusChip;


