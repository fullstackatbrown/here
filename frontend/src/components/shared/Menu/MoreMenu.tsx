import { IconButton, Menu, MenuItem } from "@mui/material";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { CoursePermission } from "model/user";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FC, useState } from "react";
import StyledMenu from "@components/shared/Menu/StyledMenu";

export interface MoreMenuProps {
    keys: string[];
    handlers: (() => void)[];
}

const MoreMenu: FC<MoreMenuProps> = ({ keys, handlers }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSelect = (handler: () => void) => {
        return () => {
            handler();
            handleClose();
        }
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton size="small" onClick={handleOpen}>
                <MoreVertIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <StyledMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {keys.map((s, i) => {
                    return <MenuItem sx={{ fontSize: 14 }} key={s} onClick={handleSelect(handlers[i])} >
                        {s}
                    </MenuItem>
                })}
            </StyledMenu>
        </>
    );
}


export default MoreMenu;