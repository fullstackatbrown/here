import IconButton from "@components/shared/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from "@mui/icons-material/Send";
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Survey } from "model/survey";
import { FC, MouseEvent, useState } from "react";
import CreateSurveyDialog from "./CreateEditSurveyDialog";

export interface SurveyListItemMenu {
    survey: Survey;
}

const SurveyListItemMenu: FC<SurveyListItemMenu> = ({ survey }) => {

    const [updateSurveyDialog, setUpdateSurveyDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        // stop the outer click handler from firing
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => setAnchorEl(null);

    const handlePublish = () => {
        handleClose()
        const confirmed = confirm("Are you sure you want to publish this survey?");
        if (confirmed) {
            // QueueAPI.deleteTicket(ticket.id, queueID, ticket.status, isTA)
            //     .catch(() => {
            //         toast.error(errors.UNKNOWN);
            //     });
        }
    }

    const handleDelete = () => {
        handleClose()
        const confirmed = confirm("Are you sure you want to delete this survey?");
    }

    const handleEdit = () => {
        handleClose()
        setUpdateSurveyDialog(true)
    }

    return <div>
        <CreateSurveyDialog
            open={updateSurveyDialog}
            onClose={() => setUpdateSurveyDialog(false)}
            update={true}
        />
        <IconButton
            label="More options"
            onClick={handleClick}
        >
            <MoreHorizIcon />
        </IconButton>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={(event) => { event.stopPropagation() }}
        >

            {survey.published &&
                <MenuItem onClick={() => { }}>
                    <ListItemIcon>
                        <CancelScheduleSendIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Unpublish</ListItemText>
                </MenuItem>
            }
            {!survey.published &&

                <MenuItem onClick={handlePublish}>
                    <ListItemIcon>
                        <SendIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Publish</ListItemText>
                </MenuItem>
            }
            {!survey.published &&

                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
            }


            <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                    <CloseIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
            </MenuItem>
        </Menu>
    </div>;
};

export default SurveyListItemMenu;


