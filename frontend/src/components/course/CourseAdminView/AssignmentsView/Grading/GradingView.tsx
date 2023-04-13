import GradeChip from '@components/shared/GradeChip/GradeChip';
import SearchBar from '@components/shared/SearchBar/SearchBar';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Stack, Table, TableBody, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import MuiTableCell from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { arraySubtract, arrayUnion } from '@util/shared/array';
import formatSectionInfo from '@util/shared/formatSectionInfo';
import { filterStudentsBySearchQuery, sortStudentsByName } from '@util/shared/formatStudentsList';
import getStudentsInSection, { ALL_STUDENTS } from '@util/shared/getStudentsInSection';
import GradeAPI from 'api/grades/api';
import { useGradesForAssignment } from 'api/grades/hooks';
import { Assignment } from 'model/assignment';
import { Course, CourseUserData } from 'model/course';
import { Section } from 'model/section';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SelectMenu from '../../../../shared/SelectMenu/SelectMenu';

interface GradingViewProps {
    course: Course;
    assignment: Assignment;
    sectionsMap: Record<string, Section>;
    handleNavigateBack: () => void;
}

const TableCell = styled(MuiTableCell)(({ theme }) => ({
    padding: 15,
    ":first-of-type": {
        paddingLeft: 0,
    },
    ":last-of-type": {
        width: 120,
        maxWidth: 120,
        overflow: "hidden",
    },
}))

const GradingView: FC<GradingViewProps> = ({ course, assignment, sectionsMap, handleNavigateBack }) => {
    const sections = Object.values(sectionsMap)
    const [grades, gradesLoading] = useGradesForAssignment(course.ID, assignment.ID)
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
            toast.promise(GradeAPI.createGrade(course.ID, assignment.ID, userID, grade, "temp_ta_id"),
                {
                    loading: "Submitting grade...",
                    success: "Grade submitted!",
                    error: "Error submitting grade"
                })
                .then(() => setEditGrade(null))
                .catch(() => setEditGrade(null))
        }
    }

    const handleUpdateGrade = (gradeID: string, userID: string) => {
        return (grade: number) => {
            toast.promise(GradeAPI.updateGrade(course.ID, assignment.ID, gradeID, grade, "temp_ta_id"),
                {
                    loading: "Updating grade...",
                    success: "Grade updated!",
                    error: "Error updating grade"
                })
                .then(() => setEditGrade(null))
                .catch(() => setEditGrade(null))
        }
    }

    const handleDeleteGrade = (gradeID: string) => {
        return () => {
            toast.promise(GradeAPI.deleteGrade(course.ID, assignment.ID, gradeID),
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
            <Stack direction="row" justifyContent="space-between" mb={1} ml={-4.5} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton size="small" sx={{ p: 0.5 }} onClick={handleNavigateBack}>
                        <ArrowBackIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <Typography variant="h6" fontWeight={600}>
                        {assignment.name}
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center">
                    <SelectMenu
                        value={filterBySection}
                        formatOption={formatOptions}
                        options={sectionOptions()}
                        onSelect={(val) => setFilterBySection(val)}
                    />
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </Stack>
            </Stack >
            <Table>
                <colgroup>
                    <col width="40%" />
                    <col width="30%" />
                    <col width="30%" />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Graded by</TableCell>
                    </TableRow>
                </TableHead>
                <ClickAwayListener onClickAway={() => setEditGrade(null)}>
                    <TableBody>
                        {currentStudentsDisplayed
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((student) => {
                                const userID = student.studentID
                                const grade = grades && userID in grades ? grades[userID] : undefined
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
                                            handleUpdateGrade={grade ? handleUpdateGrade(grade.ID, userID) : undefined}
                                            handleDeleteGrade={grade ? handleDeleteGrade(grade.ID) : undefined}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {grade ? grade.gradedBy : "/"}
                                    </TableCell>
                                </TableRow>
                            }
                            )}
                    </TableBody>
                </ClickAwayListener>
            </Table>
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