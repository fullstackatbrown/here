import { Box, Divider, Grid, TablePagination, Typography, useMediaQuery } from "@mui/material";
import { Theme, styled } from "@mui/material/styles";
import formatSectionInfo from "@util/shared/section";
import { sortByName } from "@util/shared/user";
import { Course, CourseUserData } from 'model/course';
import { Section } from "model/section";
import { User } from "model/user";
import { FC, useMemo, useState } from "react";

export interface PeopleTableForStudentsProps {
    course: Course;
    students: CourseUserData[];
    sectionsMap: Record<string, Section>;
    currentUser?: User;
    page: number;
    setPage: (page: number) => void;
}

const GridItem = styled(Grid)(({ theme }) => ({
    display: "flex",
    alignItems: "center"
}))

const TableHeader = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontSize: 14
}))

const PeopleTableForStudents: FC<PeopleTableForStudentsProps> = ({ students, sectionsMap, currentUser, page, setPage }) => {
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const rowsPerPage = isXsScreen ? -1 : 8;

    const studentsDisplayed = useMemo(() => {
        return sortByName(students) as CourseUserData[]
    }, [students])

    return (
        <>
            {!isXsScreen &&
                <>
                    <Grid container my={2}>
                        <GridItem item xs={6} md={4.5}>
                            <TableHeader>Name</TableHeader>
                        </GridItem>
                        <GridItem item xs={6} md={7.5}>
                            <TableHeader>Section</TableHeader>
                        </GridItem>
                    </Grid>
                    <Divider />
                </>
            }
            {(rowsPerPage > 0 && studentsDisplayed.length > rowsPerPage
                // only paginate when the number of students displayed is greater than the number of rows per page
                ? studentsDisplayed.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : studentsDisplayed
            ).map((s) =>
                <Box key={s.email}>
                    <Grid container py={1.8} >
                        <GridItem item xs={6} md={4.5}>
                            <Typography fontSize={isXsScreen ? 15 : 14}>
                                {s.displayName} {s.studentID === currentUser.ID && "(Me)"}
                            </Typography>
                        </GridItem>
                        <GridItem item xs={6} md={7.5}>
                            <Typography fontSize={isXsScreen ? 15 : 14} >
                                {s.defaultSection ? formatSectionInfo(sectionsMap[s.defaultSection], true) : "Unassigned"}
                            </Typography>
                        </GridItem>
                    </Grid>
                    <Divider />
                </Box>
            )}
            {!isXsScreen && studentsDisplayed.length > rowsPerPage &&
                <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={studentsDisplayed.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event: unknown, newPage: number) => setPage(newPage)}
                />
            }
        </>
    )
}

export default PeopleTableForStudents;