import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Box, Chip, IconButton, Stack, Typography, useTheme } from "@mui/material";
import getInitials from "@util/shared/getInitials";
import { useAdmins, useAuth } from "api/auth/hooks";
import CancelIcon from '@mui/icons-material/Cancel';
import { User } from 'model/user';
import { FC, useState } from "react";
import { handleBadRequestError } from '@util/errors';
import AuthAPI from 'api/auth/api';
import toast from 'react-hot-toast';

export interface AdminChipProps {
    admin: User;
}

const AdminChip: FC<AdminChipProps> = ({ admin }) => {
    const [hover, setHover] = useState(false);
    const { currentUser } = useAuth();
    console.log(currentUser)

    const handleDeleteAdmin = () => {
        const confirmed = confirm(`Are you sure you want to remove ${admin.displayName} as a site admin?`);
        if (!confirmed) return;
        toast.promise(AuthAPI.editAdminAccess(admin.email, false), {
            loading: "Removing admin...",
            success: "Removed admin!",
            error: (err) => handleBadRequestError(err),
        })
            .catch(() => { })
    }
    return (
        <Box
            sx={{ borderRadius: 5, p: 1, mr: 1.5, border: "1px solid #e0e0e0" }}
            key={admin.id} display="flex" flexDirection="row" alignItems="center"
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
            {currentUser?.id !== admin.id &&
                <Box width={30}>
                    {hover &&
                        <IconButton sx={{ p: 0.5 }} onClick={handleDeleteAdmin}>
                            <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    }
                </Box>
            }
        </Box>
    )

};

export default AdminChip;

