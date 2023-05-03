import { Chip, ChipProps, styled } from "@mui/material";
import { brown, indigo, teal } from "@mui/material/colors";
import { CoursePermission } from "model/user";
import { FC } from "react";

export interface UserAccessChipProps {
    access: CoursePermission;
    size?: "small" | "medium";
    variant?: "outlined" | "filled";
}

interface MyChipProps extends ChipProps {
    myColor?: string;
}

const MyChip = styled(Chip)<MyChipProps>(({ size, variant, myColor }) => {
    let style = {}
    switch (size) {
        case "medium":
            style = {
                height: 24,
                fontSize: 14,
                fontWeight: 500,
                '& .MuiChip-label': {
                    paddingLeft: 8,
                    paddingRight: 8,
                },
            }
            break
        default:
            style = {
                height: 18,
                fontSize: 12,
                fontWeight: 500,
                '& .MuiChip-label': {
                    paddingLeft: 6,
                    paddingRight: 6,
                },
            }
    }
    switch (variant) {
        case "outlined":
            style['borderColor'] = myColor
            style['color'] = myColor
            break
        default:
            style['backgroundColor'] = myColor
            style['color'] = 'white'
    }
    return style
});


const UserAccessChip: FC<UserAccessChipProps> = ({ access, size, variant = "filled" }) => {
    switch (access) {
        case CoursePermission.CourseAdmin:
            return <MyChip label="admin" myColor={teal[600]} {...{ size, variant }} />;
        case CoursePermission.CourseStaff:
            return <MyChip label="staff" myColor={indigo[400]} {...{ size, variant }} />;
        default:
            return <MyChip label="student" myColor={brown[600]} {...{ size, variant }} />;
    }
};

export default UserAccessChip;


