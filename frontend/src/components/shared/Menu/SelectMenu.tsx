import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, Menu, MenuItem, MenuProps, PopoverOrigin, Theme, buttonClasses, styled, useMediaQuery, useTheme } from "@mui/material";
import { FC, useState } from "react";

interface SelectMenuProps {
    value: string;
    options: string[];
    onSelect: (value: string) => void;
    formatOption: (value: string) => string;
    defaultValue?: string; // if this is set, the button will be colored differently if the value is the default
    startIcon?: JSX.Element;
}

const StyledMenu = styled((props: MenuProps) => {
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const anchorOrigin: PopoverOrigin = isXsScreen
        ? {
            vertical: 'bottom',
            horizontal: 'left',
        }
        : {
            vertical: 'bottom',
            horizontal: 'right',
        };
    const transformOrigin: PopoverOrigin = isXsScreen
        ? {
            vertical: 'top',
            horizontal: 'left',
        }
        : {
            vertical: 'top',
            horizontal: 'right',
        };

    return <Menu
        elevation={0}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        {...props}
    />
})(({ theme }) => ({
    '& .MuiPaper-root': {
        marginTop: 8,
        borderRadius: 6,
        minWidth: 180,
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    },
}));

const SelectMenu: FC<SelectMenuProps> = ({ value, options, onSelect, formatOption, defaultValue, startIcon }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();
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
            startIcon={startIcon}
            endIcon={<KeyboardArrowDownIcon sx={{ ml: -.5 }} />}
            color={defaultValue !== undefined && value === defaultValue ? "secondary" : "primary"}
            sx={{
                py: 0.2,
                px: 1.2,
                border: { xs: ".5px solid", md: "none" },
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 500,
                [`& .${buttonClasses.endIcon} > *:nth-of-type(1)`]: {
                    fontSize: "15px"
                },
            }}
            disableRipple
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