import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import getInitials from "@util/shared/getInitials";
import { useAdminInvites, useAdmins, useAuth, useCourseInvites } from "api/auth/hooks";
import { FC } from "react";
import AdminChip from './AdminChip';
import AddAdminButton from '@components/manage/AdminList/AddAdminButton';
import { unique } from '@util/shared/array';

export interface AdminListProps {
}

const AdminList: FC<AdminListProps> = ({ }) => {
    const [admins, loading] = useAdmins();
    const [adminInvites, adminInvitesLoading] = useAdminInvites();

    return <>
        <Box>
            <Typography variant="h6" fontWeight={600} mb={1.5}>
                Site Admin
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap" ml={-1}>
                {admins?.map(admin =>
                    <Box minWidth="25%" display="flex" mr={3} mb={2}>
                        <AdminChip admin={admin} />
                    </Box>
                )}
                {adminInvites && unique(adminInvites).map(invite =>
                    <Box minWidth="25%" display="flex" mr={3} mb={2}>
                        <AdminChip email={invite} />
                    </Box>
                )}
                <Box display="flex" mr={3} mb={2}>
                    < AddAdminButton />
                </Box>
            </Box>
        </Box>
    </>;
};

export default AdminList;


