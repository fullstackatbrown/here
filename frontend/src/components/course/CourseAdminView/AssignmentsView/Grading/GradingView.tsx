import GradeChip from '@components/shared/GradeChip/GradeChip';
import { ClickAwayListener } from '@mui/base';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Stack, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material';
import MuiTableCell from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { arraySubtract, arrayUnion } from '@util/shared/array';
import formatSectionInfo from '@util/shared/formatSectionInfo';
import getStudentsInSection from '@util/shared/getStudentsInSection';
import GradeAPI from 'api/grades/api';
import { useGrades } from 'api/grades/hooks';
import { useSections } from 'api/section/hooks';
import { Assignment } from 'model/assignment';
import { Course } from 'model/course';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SectionsMenu from './MyMenu';
import listToMap from '@util/shared/listToMap';
import { Section } from 'model/section';

interface GradingViewProps {
    course: Course;
    assignment: Assignment;
    handleNavigateBack: () => void;
}

const TableCell = styled(MuiTableCell)(({ theme }) => ({
    ":first-of-type": {
        paddingLeft: 0,
    },
    ":last-of-type": {
        width: 120,
        maxWidth: 120,
        overflow: "hidden",
    },
}))

const GradingView: FC<GradingViewProps> = ({ course, assignment, handleNavigateBack }) => {
    const [sections, sectionsLoading] = useSections(course.ID)
    const [sectionsMap, setSectionsMap] = useState<Record<string, Section>>({})
    const [selectedSection, setSelectedSection] = useState<string | undefined>(undefined)
    const [grades, gradesLoading] = useGrades(course.ID, assignment.ID)
    const [editGrade, setEditGrade] = useState<string | null>(null) // userid

    useEffect(() => {
        sections && setSectionsMap(listToMap(sections) as Record<string, Section>)
    }, [sections])

    const getStudents = () => {
        if (!selectedSection) {
            return course.students ? Object.keys(course.students) : []
        } else {
            if (!course.students) return []
            const section = sectionsMap[selectedSection]
            let students = getStudentsInSection(course.students, selectedSection)
            // filter out swapped out students
            if (section.swappedOutStudents && assignment.ID in section.swappedOutStudents) {
                students = arraySubtract(students, section.swappedOutStudents[assignment.ID])
            }

            // add in swapped in students
            if (section.swappedInStudents && assignment.ID in section.swappedInStudents) {
                students = arrayUnion(students, section.swappedInStudents[assignment.ID])
            }
            return students
        }
    }

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
        let options = [undefined]
        sectionsMap && Object.keys(sectionsMap).forEach((sectionID) => {
            options.push(sectionID)
        })
        return options
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
                <SectionsMenu
                    value={selectedSection}
                    formatOption={(val) => val ? formatSectionInfo(sectionsMap[val], true, true) : "All Sections"}
                    options={sectionOptions()}
                    onSelect={(val) => setSelectedSection(val)}
                />
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
                        {getStudents().map((userID) => {
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

        </>
    );
}

export default GradingView;