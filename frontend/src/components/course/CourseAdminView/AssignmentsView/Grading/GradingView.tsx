import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import { Assignment } from 'model/assignment';
import { Course } from 'model/course';
import { FC } from 'react';

interface GradingViewProps {
    course: Course;
    assignment: Assignment;
    handleNavigateBack: () => void;

}
const GradingView: FC<GradingViewProps> = ({ course, assignment, handleNavigateBack }) => {
    return (
        <>
            <Stack direction="row" justifyContent="space-between" mb={1}>
                <Stack direction="row" spacing={2}>
                    <Typography variant="h6" fontWeight={600}>
                        {assignment.name}
                    </Typography>
                    <IconButton size="small" onClick={handleNavigateBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </Stack>
            </Stack>

        </>
    );
}

export default GradingView;