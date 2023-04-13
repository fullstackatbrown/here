import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Box, Chip, IconButton, Stack, Typography, useTheme } from "@mui/material";
import getInitials from "@util/shared/getInitials";
import { useAdmins, useAuth } from "api/auth/hooks";
import CancelIcon from '@mui/icons-material/Cancel';
import { User } from 'model/user';
import { FC, useState } from "react";

export interface AdminChipProps {
    admin: User;
}

const AdminChip: FC<AdminChipProps> = ({ admin }) => {
    const [hover, setHover] = useState(false);

    const handleDeleteAdmin = () => {
        console.log("delete admin");
    }
    return (
        <Box
            sx={{ borderRadius: 5, py: 1, pl: 1, pr: 0.5, mr: 1.5, border: "1px solid #e0e0e0" }}
            key={admin.ID} display="flex" flexDirection="row" alignItems="center"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Avatar src={admin.photoUrl}>
                {getInitials(admin.displayName)}
            </Avatar>
            <Stack mx={1}>
                <Typography fontSize={14}>
                    {admin.displayName}
                </Typography>
                <Typography fontSize={13} color="secondary">
                    {admin.email}
                </Typography>
            </Stack>
            <Box width={30}>
                {hover &&
                    <IconButton sx={{ p: 0.5 }} onClick={handleDeleteAdmin}>
                        <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                }
            </Box>
        </Box>
    )

};

export default AdminChip;


