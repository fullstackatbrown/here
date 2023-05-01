import React, { FC } from "react";
import { Chip, styled } from "@mui/material";
import { Course } from "model/course";
import { CoursePermission } from "model/user";

export interface UserAccessChipProps {
    access: CoursePermission;
    size?: "small" | "medium";
    variant?: "outlined" | "filled";
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


const UserAccessChip: FC<UserAccessChipProps> = ({ access, size, variant }) => {
    switch (access) {
        case CoursePermission.CourseAdmin:
            return <MyChip label="admin" color="primary" {...{ size, variant }} />;
        case CoursePermission.CourseStaff:
            return <MyChip label="staff" color="primary" {...{ size, variant }} />;
        default:
            return <MyChip label="student" color="success" {...{ size, variant }} />;
    }
};

export default UserAccessChip;


