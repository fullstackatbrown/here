import { FC } from "react";
import {
    Box,
    ListItem,
    ListItemText,
    Paper,
} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import ClearIcon from '@mui/icons-material/Clear';
import { toast } from "react-hot-toast";
import AuthAPI from "api/auth/api";
import { Notification } from "model/user";
import { formatDistance } from "date-fns";

export interface NotificationItemProps {
    notification: Notification
}

const NotificationItem: FC<NotificationItemProps> = ({ notification }) => {
    return <Paper variant="elevation" elevation={3}>
        <Box>
            <ListItem
                secondaryAction={
                    <IconButton edge="end" label="Clear notification" onClick={() => {
                        AuthAPI.clearNotification(notification.ID)
                            .catch(() => toast.error("Error clearing notification."));
                    }}>
                        <ClearIcon />
                    </IconButton>
                }
            >
                <ListItemText primary={notification.Title}
                    secondary={`${notification.Body} (${formatDistance(notification.Timestamp.toDate(), new Date(), { addSuffix: true })})`} />
            </ListItem>
        </Box>
    </Paper>;
};

export default NotificationItem;