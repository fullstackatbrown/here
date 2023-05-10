import MyChip from "@components/shared/MyChip/MyChip";
import { brown, indigo, teal } from "@mui/material/colors";
import { CoursePermission } from "model/user";
import { FC } from "react";

export interface UserAccessChipProps {
    access: CoursePermission;
    size?: "small" | "medium";
    variant?: "outlined" | "filled";
    style?: React.CSSProperties;
}

const UserAccessChip: FC<UserAccessChipProps> = ({ access, size, variant = "filled", style }) => {
    switch (access) {
        case CoursePermission.CourseAdmin:
            return <MyChip label="admin" mycolor={teal[600]} {...{ size, variant, style }} />;
        case CoursePermission.CourseStaff:
            return <MyChip label="staff" mycolor={indigo[400]} {...{ size, variant, style }} />;
        default:
            return <MyChip label="student" mycolor={brown[600]} {...{ size, variant, style }} />;
    }
};

export default UserAccessChip;


