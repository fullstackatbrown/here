import { useDialog } from "@components/shared/ConfirmDialog/ConfirmDialogProvider";
import { Grid, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { formatDistance } from "date-fns";
import { Course } from "model/course";
import { Survey } from "model/survey";
import { User } from "model/user";
import { FC, useMemo, useState } from "react";

export interface StudentSurveyCardProps {
    survey: Survey;
    course: Course;
    student: User;
}


// <Grid container spacing={2} key={info.survey.ID}>
//     <Grid item xs={12} sm={6} md={4} >
//         {info.survey.name}
//     </Grid>
//     <Grid item xs={12} sm={6} md={4}>
//         {info.ended ? "Ended" : "Ending"} {formatDistance(new Date(info.survey.endTime), new Date(), { addSuffix: true })}
//     </Grid>
//     <Grid item xs={12} sm={6} md={4}>
//         {info.filledOut ? "Filled out" : "Not filled out"}
//     </Grid>
// </Grid>

const StudentSurveyCard: FC<StudentSurveyCardProps> = ({ survey, course, student }) => {

    const filledOut = useMemo(() => survey.responses?.[student.ID] !== undefined, [survey, student]);
    const ended = useMemo(() => survey.endTime && new Date(survey.endTime) < new Date(), [survey]);

    const [hover, setHover] = useState(false);
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const showDialog = useDialog();
    const theme = useTheme();

    function onClickEditSwap(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
    }

    return (
        <>
            <Grid container
                sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
                mx={-1}
                py={1.5}
                width="100%"
                display="flex" flexDirection="row" alignItems="center"
                onMouseEnter={() => !isXsScreen && setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {/* Left: arrow and student name */}
                <Grid item xs={8} md={3}>
                    <Typography sx={{ fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", ml: 1 }}>
                        {survey.name}
                    </Typography>
                </Grid>

                {/* Middle: request info, only display on hover, no display on mobile */}
                <Grid item md={7} display={{ xs: "none", md: "flex" }} alignItems="center">
                    <Typography color="secondary" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 14 }}>
                        {ended ? "Ended" : "Ending"} {formatDistance(new Date(survey.endTime), new Date(), { addSuffix: true })}
                    </Typography>
                </Grid>

                {/* Right: either time or the buttons */}
                <Grid item xs={4} md={2} display="flex" justifyContent="flex-end" alignItems="center">
                    {/* {(hover || expanded) && isCourseActive && pending ? (
                            <>
                                <Tooltip title="edit">
                                    <IconButton sx={{ p: { xs: 1, md: 0.5 }, color: "inherit" }} onClick={onClickEditSwap}>
                                        <EditIcon sx={{ fontSize: { xs: 20, md: 18 } }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="cancel">
                                    <IconButton sx={{ p: { xs: 1, md: 0.5 }, color: "inherit" }} onClick={onClickCancelSwap}>
                                        <CloseIcon sx={{ fontSize: { xs: 20, md: 18 } }} />
                                    </IconButton>
                                </Tooltip>
                            </>
                        ) : (
                            <StatusChip status={request.status} timestamp={pending ? request.requestTime : request.handledTime} />
                        )} */}
                </Grid>
            </Grid>

        </>
    );
};

export default StudentSurveyCard;
