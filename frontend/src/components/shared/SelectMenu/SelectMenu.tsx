import { Button, MenuItem, Divider, styled, MenuProps, Menu, alpha, Typography } from "@mui/material";
import { FC, useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface SelectMenuProps {
    value: string;
    options: string[];
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
        minWidth: 180,
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    },
}));

const SelectMenu: FC<SelectMenuProps> = ({ value, options, onSelect, formatOption }) => {
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
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}

        >
            {options.map((val) => {
                return <>
                    <MenuItem sx={{ fontSize: 14 }} value={val} key={val} onClick={() => onSelect(val)} >
                        {formatOption(val)}
                    </MenuItem>
                </>
            })}
        </StyledMenu >
    </>
}

export default SelectMenu