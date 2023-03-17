import React, { FC } from "react";
import { Chip } from "@mui/material";
import { Course } from "model/course";

export interface UserAccessChipProps {
    access: "admin" | "staff" | "student";
    size?: "small" | "medium";
}

const QueueStatusChip: FC<UserAccessChipProps> = ({ access, size }) => {
    switch (access) {
        case "admin":
            return <Chip label="Admin" size={size} color="primary" sx={{ fontWeight: 600 }} />;
        case "staff":
            return <Chip label="Staff" size={size} color="primary" sx={{ fontWeight: 600 }} />;
        case "student":
            return <Chip label="Student" size={size} color="success" sx={{ fontWeight: 600 }} />;
        default:
            return <Chip label="Student" size={size} color="success" sx={{ fontWeight: 600 }} />;
    }
};

export default QueueStatusChip;


