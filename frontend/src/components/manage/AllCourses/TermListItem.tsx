import CourseAccessList from "@components/manage/AllCourses/CourseAccessList";
import { ExpandMore } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Collapse, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { capitalizeWords } from "@util/shared/string";
import { Course } from "model/course";
import { FC, useState } from "react";
import CreateEditCourseDialog from "../CreateEditCourseDialog/CreateEditCourseDialog";

interface TermListItemProps {
    term: string;
    courses: Course[];
}
const TermListItem: FC<TermListItemProps> = ({ term, courses }) => {
    const [expanded, setExpanded] = useState(false);
    const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);
    const [hover, setHover] = useState(false);
    const theme = useTheme();

    const handleOpenAddCourseDialog = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setAddCourseDialogOpen(true);
    }

    return (
        <>
            <CreateEditCourseDialog open={addCourseDialogOpen} onClose={() => setAddCourseDialogOpen(false)} courseTerm={term} />
            <Box
                sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
                ml={-4}
                px={1}
                py={0.5}
                onClick={() => setExpanded(!expanded)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={4} alignItems="center" py={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box width={17} display="flex" alignItems="center">
                                {expanded ?
                                    <ExpandMore sx={{ fontSize: 16 }} /> :
                                    <KeyboardArrowRightIcon
                                        sx={{ fontSize: 16, color: "text.disabled" }}
                                    />
                                }
                            </Box>
                            <Typography fontSize={17} fontWeight={500}>{capitalizeWords(term)}</Typography>
                            <Typography fontSize={16} color="secondary">{courses.length} course{courses.length > 1 && "s"}</Typography>
                        </Stack>
                    </Stack>
                    {hover &&
                        <Stack direction="row" alignItems="center">
                            <Tooltip title="Add a Course">
                                <IconButton sx={{ p: 0.8 }} onClick={handleOpenAddCourseDialog}>
                                    <AddIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    }
                </Stack >
            </Box >
            <Collapse in={expanded}>
                <Box ml={-1}>
                    {courses.length === 0 &&
                        <Typography textAlign="center">
                            No courses added for the semester yet.
                        </Typography>}
                    {courses.map((course) => (
                        <CourseAccessList key={course.ID} course={course} />)
                    )}
                </Box>
            </Collapse>
        </>
    )
}

export default TermListItem