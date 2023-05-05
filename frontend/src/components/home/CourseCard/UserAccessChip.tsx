import MyChip from "@components/shared/MyChip/MyChip";
import { brown, indigo, teal } from "@mui/material/colors";
import { CoursePermission } from "model/user";
import { FC } from "react";

export interface UserAccessChipProps {
    access: CoursePermission;
    size?: "small" | "medium";
    variant?: "outlined" | "filled";
}

const UserAccessChip: FC<UserAccessChipProps> = ({ access, size, variant = "filled" }) => {
    switch (access) {
        case CoursePermission.CourseAdmin:
            return <MyChip label="admin" mycolor={teal[600]} {...{ size, variant }} />;
        case CoursePermission.CourseStaff:
            return <MyChip label="staff" mycolor={indigo[400]} {...{ size, variant }} />;
        default:
            return <MyChip label="student" mycolor={brown[600]} {...{ size, variant }} />;
    }
};

export default UserAccessChip;


