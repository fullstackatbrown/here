import { Button, MenuItem, Divider, styled, MenuProps, Menu, alpha, Typography } from "@mui/material";
import { FC, useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StyledMenu from "./StyledMenu";

interface SelectMenuProps {
    value: string;
    options: string[];
    onSelect: (value: string) => void;
    formatOption: (value: string) => string;
}

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
            sx={{ py: 0.3 }}
        >
            {formatOption(value)}
        </Button>
        <StyledMenu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            {options.map((val) => {
                return <MenuItem sx={{ fontSize: 14 }} value={val} key={val} onClick={() => onSelect(val)} >
                    {formatOption(val)}
                </MenuItem>
            })}
        </StyledMenu >
    </>
}

export default SelectMenu