import { Button, MenuItem, Divider, styled, MenuProps, Menu, alpha } from "@mui/material";
import { FC, useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface MyMenuProps {
    value: string;
    options: string[];
    // options: Record<string, string>; // a map from the value to the display name
    onSelect: (value: string) => void;
    formatOption: (value: string) => string;
}

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

const MyMenu: FC<MyMenuProps> = ({ value, options, onSelect, formatOption }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return <>
        <Button
            variant="text"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
        >
            {formatOption(value)}
        </Button>
        <StyledMenu
            elevation={0}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}

        >
            {options.map((val) => {
                return <>
                    <MenuItem value={val} key={val} onClick={() => onSelect(val)}>
                        {formatOption(val)}
                    </MenuItem>
                    <Divider />
                </>
            })}
        </StyledMenu >
    </>
}

export default MyMenu