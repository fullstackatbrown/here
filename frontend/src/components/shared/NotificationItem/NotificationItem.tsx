import ClearIcon from '@mui/icons-material/Clear';
import {
    Box,
    IconButton,
    ListItem,
    ListItemText,
    Paper,
    Tooltip,
} from "@mui/material";
import AuthAPI from "api/auth/api";
import { formatDistance } from "date-fns";
import { Notification } from "model/user";
import { FC } from "react";
import { toast } from "react-hot-toast";

export interface NotificationItemProps {
    notification: Notification
}

const NotificationItem: FC<NotificationItemProps> = ({ notification }) => {
    return <Paper variant="elevation" elevation={3}>
        <Box>
            <ListItem
                secondaryAction={
                    <Tooltip title="Clear notification">
                        <IconButton edge="end" onClick={() => {
                            AuthAPI.clearNotification(notification.ID)
                                .catch(() => toast.error("Error clearing notification."));
                        }}>
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                }
            >
                <ListItemText primary={notification.Title}
                    secondary={`${notification.Body} (${formatDistance(notification.Timestamp.toDate(), new Date(), { addSuffix: true })})`} />
            </ListItem>
        </Box>
    </Paper>;
};

export default NotificationItem;