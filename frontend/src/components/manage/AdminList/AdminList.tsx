import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import getInitials from "@util/shared/getInitials";
import { useAdmins, useAuth } from "api/auth/hooks";
import { FC } from "react";
import AdminChip from './AdminChip';
import AddAdminButton from '@components/manage/AdminList/AddAdminButton';

export interface AdminListProps {
}

const AdminList: FC<AdminListProps> = ({ }) => {
    const [admins, loading] = useAdmins();

    return <>
        <Box>
            <Typography variant="h6" fontWeight={600} mb={1.5}>
                Site Admin
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap" ml={-1}>
                {admins?.map(admin => <AdminChip admin={admin} />)}
                <AddAdminButton />
            </Box>
        </Box>
    </>;
};

export default AdminList;


