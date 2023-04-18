import { Stack, Typography, Button, Menu, MenuItem, MenuProps, styled } from "@mui/material";
import { access } from "fs";
import { View } from "model/general";
import { CoursePermission } from "model/user";
import { FC, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { capitalizeFirstLetter } from "@util/shared/string";
import { useRouter } from "next/router";

interface ViewHeaderProps {
    view: View;
    views: View[];
    access: CoursePermission;
}

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        // anchorOrigin={{
        //     vertical: 'bottom',
        //     horizontal: 'left',
        // }}
        transformOrigin={{
            vertical: 0,
            horizontal: -5,
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        ml: 2,
        // width: "100%",
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -2px',
    },
}));

const ViewHeader: FC<ViewHeaderProps> = ({ view, views, access }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function navigateTo(view: View) {
        return router.push(`${router.query.courseID}?view=${view}`, undefined, { shallow: true });
    }

    return (
        <>
            <Typography variant="h6" fontWeight={600} sx={{ fontSize: 20, fontWeight: 600, display: { xs: "none", md: "block" } }}>
                {capitalizeFirstLetter(view)}
            </Typography>
            <Button
                color="inherit" variant="text" sx={{ fontSize: 20, fontWeight: 600, ml: -1, display: { md: "none" } }}
                endIcon={<MenuIcon />}
                onClick={handleClick}
            >
                {capitalizeFirstLetter(view)}
            </Button >
            <StyledMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ display: { md: "none" } }}
            >
                {views.map((view) => {
                    if (view === "settings" && access !== CoursePermission.CourseAdmin) return <></>;
                    return <MenuItem sx={{ fontSize: 18, py: 0, mr: 2 }} onClick={() => navigateTo(view)} >
                        {capitalizeFirstLetter(view)}
                    </MenuItem>
                })}
            </StyledMenu >

        </>
    )
}

export default ViewHeader;