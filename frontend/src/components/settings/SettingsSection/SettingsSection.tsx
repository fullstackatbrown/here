import React, { FC } from "react";
import { Box, CircularProgress, Paper, Stack, Tooltip, Typography } from "@mui/material";
import Button from "@components/shared/Button";
import { useAuth } from "api/auth/hooks";
import GppGoodIcon from '@mui/icons-material/GppGood';
import { CoursePermission } from "model/user";

export interface SettingsSectionProps {
    title: string;
    subtitle?: string;
    loading?: boolean;
    adminOnly?: boolean;
    taOnly?: boolean;
    children: React.ReactNode;
}

const SettingsSection: FC<SettingsSectionProps> = ({
    title,
    subtitle,
    loading,
    adminOnly,
    taOnly,
    children
}) => {
    const { currentUser } = useAuth();
    const isAdmin = currentUser && Object.values(currentUser.permissions).filter(perm => perm === CoursePermission.CourseAdmin).length > 0;
    const display = ((adminOnly && currentUser?.isAdmin) || !adminOnly) && (!taOnly || (taOnly && isAdmin));

    return display ? <Paper variant="outlined">
        <Box p={3}>
            <Stack direction={["column", null, "row"]} justifyContent="space-between" alignItems="start">
                <Stack mb={subtitle ? 2 : 0}>
                    <Stack direction="row" justifyContent="start" alignItems="center" spacing={0.5}>
                        <Typography variant="h6" fontWeight={600}>
                            {title}
                        </Typography>
                        {adminOnly && <Tooltip title="Only visible to admins" placement="right">
                            <GppGoodIcon sx={{ opacity: 0.36 }} />
                        </Tooltip>}
                    </Stack>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        {subtitle}
                    </Typography>
                </Stack>
            </Stack>
            {loading ? <Box textAlign="center" py={2}>
                <CircularProgress />
            </Box> : children}
        </Box>
    </Paper> : <></>;
};

export default SettingsSection;


