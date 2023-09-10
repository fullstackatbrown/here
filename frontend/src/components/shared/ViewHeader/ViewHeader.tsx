import MenuIcon from '@mui/icons-material/Menu';
import { Button, Menu, MenuItem, MenuProps, Typography, styled } from "@mui/material";
import { capitalizeWords } from "@util/shared/string";
import { View } from "model/general";
import { CoursePermission } from "model/user";
import { useRouter } from "next/router";
import { FC, useState } from "react";

interface ViewHeaderProps {
    view: View;
    views: View[];
}

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
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

const ViewHeader: FC<ViewHeaderProps> = ({ view, views }) => {
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
            {/* only show for md screen */}
            <Typography variant="h6" fontSize={20} fontWeight={600} sx={{ display: { xs: "none", md: "block" } }}>
                {capitalizeWords(view)}
            </Typography>
            {/* only show for xs screen */}
            <Button
                color="inherit" variant="text" sx={{ fontSize: 18, fontWeight: 600, ml: -1, display: { md: "none" } }}
                endIcon={<MenuIcon />}
                onClick={handleClick}
            >
                {capitalizeWords(view)}
            </Button >
            <StyledMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ display: { md: "none" } }}
            >
                {views.map((view) => {
                    return <MenuItem key={view} sx={{ fontSize: 18, py: 0, mr: 2 }} onClick={() => navigateTo(view)} >
                        {capitalizeWords(view)}
                    </MenuItem>
                })}
            </StyledMenu >

        </>
    )
}

export default ViewHeader;