import GradeChip from '@components/shared/GradeChip/GradeChip';
import SearchBar from '@components/shared/SearchBar/SearchBar';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { Button, Stack, Table, TableBody, TableHead, TablePagination, TableRow, Typography, useMediaQuery } from '@mui/material';
import MuiTableCell from "@mui/material/TableCell";
import { Theme, styled } from "@mui/material/styles";
import { arraySubtract, arrayUnion } from '@util/shared/array';
import formatSectionInfo from '@util/shared/formatSectionInfo';
import { filterStudentsBySearchQuery, sortStudentsByName } from '@util/shared/formatStudentsList';
import getStudentsInSection, { ALL_STUDENTS } from '@util/shared/getStudentsInSection';
import GradeAPI from 'api/grades/api';
import { Assignment } from 'model/assignment';
import { Course, CourseUserData } from 'model/course';
import { Section } from 'model/section';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SelectMenu from '../../../../shared/Menu/SelectMenu';
import ViewHeader from '../../../../shared/ViewHeader/ViewHeader';
import { CoursePermission } from 'model/user';

interface GradingViewProps {
    course: Course;
    access: CoursePermission;
    assignment: Assignment;
    sectionsMap: Record<string, Section>;
}

const TableCell = styled(MuiTableCell)(({ theme }) => ({
    padding: 13,
    ":first-of-type": {
        paddingLeft: 0,
    },
    ":last-of-type": {
        width: 120,
        maxWidth: 120,
        overflow: "hidden",
    },
}))

const GradingView: FC<GradingViewProps> = ({ course, assignment, sectionsMap, access }) => {
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const [filterBySection, setFilterBySection] = useState<string>(ALL_STUDENTS)
    const [editGrade, setEditGrade] = useState<string | null>(null) // userid of the grade that is being edited

    const rowsPerPage = 10;
    const [page, setPage] = useState(0);
    const [currentStudentsDisplayed, setCurrentStudentsDisplayed] = useState<CourseUserData[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")

    useEffect(() => {
        let studentIDs = []
        if (!course.students) {
            studentIDs = []
        }
        if (filterBySection === ALL_STUDENTS) {
            studentIDs = Object.keys(course.students)
        } else {
            const section = sectionsMap[filterBySection]
            studentIDs = getStudentsInSection(course.students, filterBySection)
            // filter out swapped out students
            if (section.swappedOutStudents && assignment.ID in section.swappedOutStudents) {
                studentIDs = arraySubtract(studentIDs, section.swappedOutStudents[assignment.ID])
            }

            // add in swapped in students
            if (section.swappedInStudents && assignment.ID in section.swappedInStudents) {
                studentIDs = arrayUnion(studentIDs, section.swappedInStudents[assignment.ID])
            }
        }
        let students = studentIDs.map((studentID) => course.students[studentID])
        students = filterStudentsBySearchQuery(students, searchQuery)
        setCurrentStudentsDisplayed(sortStudentsByName(students))
    }, [filterBySection, page, course.students, assignment.ID, sectionsMap, searchQuery])

    const handleSubmitGrade = (userID: string) => {
        return (grade: number) => {
            toast.promise(GradeAPI.createGrade(course.ID, assignment.ID, userID, grade),
                {
                    loading: "Submitting grade...",
                    success: "Grade submitted!",
                    error: "Error submitting grade"
                })
                .then(() => setEditGrade(null))
                .catch(() => setEditGrade(null))
        }
    }

    const handleDeleteGrade = (userID: string) => {
        return () => {
            toast.promise(GradeAPI.deleteGrade(course.ID, assignment.ID, userID),
                {
                    loading: "Deleting grade...",
                    success: "Grade deleted",
                    error: "Error deleting grade"
                })
                .then(() => setEditGrade(null))
                .catch(() => setEditGrade(null))
        }
    }

    const sectionOptions = () => {
        let options = [ALL_STUDENTS]
        sectionsMap && Object.keys(sectionsMap).forEach((sectionID) => {
            options.push(sectionID)
        })
        return options
    }

    const formatOptions = (val: string | undefined) => {
        if (val === ALL_STUDENTS) return ALL_STUDENTS
        return formatSectionInfo(sectionsMap[val], true)
    }

    return (
        <>
            <Stack direction="row" justifyContent="space-between" mb={1} alignItems="center" height={40}>
                <ViewHeader view="assignments" views={["sections", "assignments", "people", "requests", "settings"]} access={access} />
            </Stack>
            <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems={{ xs: "start", md: "center" }}
                spacing={{ xs: 1, md: 0 }}
                mb={1}
                display="flex"
                justifyContent="space-between"
            >
                <Typography
                    variant="h6"
                    fontWeight={500}
                    style={{ fontSize: 17 }}
                >
                    {assignment.name}
                </Typography>
                <Stack direction="row" display="flex" alignItems="center" spacing={1}>
                    <SelectMenu
                        value={filterBySection}
                        formatOption={formatOptions}
                        options={sectionOptions()}
                        onSelect={(val) => setFilterBySection(val)}
                        defaultValue={ALL_STUDENTS}
                    />
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </Stack>

            </Stack >
            {
                currentStudentsDisplayed.length === 0 ?
                    <Typography mt={3} textAlign="center">No students have joined this course yet.</Typography> :
                    (<Table>
                        {!isXsScreen &&
                            <colgroup>
                                <col width="40%" />
                                <col width="30%" />
                                <col width="30%" />
                            </colgroup>}
                        <TableHead>
                            <TableRow>
                                <TableCell>Student</TableCell>
                                <TableCell>Grade</TableCell>
                                {!isXsScreen && <TableCell>Graded on</TableCell>}
                            </TableRow>
                        </TableHead>
                        <ClickAwayListener onClickAway={() => setEditGrade(null)}>
                            <TableBody>
                                {currentStudentsDisplayed
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((student) => {
                                        const userID = student.studentID
                                        const grade = userID in assignment.grades ? assignment.grades[userID] : undefined
                                        return <TableRow hover key={userID} onClick={() => setEditGrade(userID)}>
                                            <TableCell component="th" scope="row">
                                                {course.students && course.students[userID] && course.students[userID].displayName}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <GradeChip
                                                    score={grade ? grade.grade : undefined}
                                                    maxScore={assignment.maxScore}
                                                    editable={editGrade && editGrade === userID}
                                                    handleCreateGrade={handleSubmitGrade(userID)}
                                                    handleDeleteGrade={grade ? handleDeleteGrade(userID) : undefined}
                                                />
                                            </TableCell>
                                            {!isXsScreen && <TableCell component="th" scope="row">
                                                {grade ? new Date(grade.timeUpdated).toLocaleDateString() : "/"}
                                            </TableCell>}
                                        </TableRow>
                                    }
                                    )}
                            </TableBody>
                        </ClickAwayListener>
                    </Table>)
            }
            {
                currentStudentsDisplayed.length > rowsPerPage && <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={currentStudentsDisplayed.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event: unknown, newPage: number) => setPage(newPage)}
                />
            }
        </>
    );
}

export default GradingView;