import SelectMenu from "@components/shared/Menu/SelectMenu";
import SearchBar from "@components/shared/SearchBar/SearchBar";
import { Box, Stack, Typography } from "@mui/material";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import { filterStudentsBySearchQuery } from "@util/shared/formatStudentsList";
import getStudentsInSection, { ALL_STUDENTS, UNASSIGNED } from "@util/shared/getStudentsInSection";
import { useCourseInvites } from "api/auth/hooks";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { CoursePermission } from "model/user";
import { useState } from "react";
import MoreMenu from "../../../shared/Menu/MoreMenu";
import ViewHeader from "../ViewHeader/ViewHeader";
import PeopleTable from "./PeopleTable";
import AddStudentDialog from "./AddStudentDialog";
import { exportStudentList } from "@util/shared/export";

export interface PeopleViewProps {
  course: Course;
  access: CoursePermission;
  sectionsMap: Record<string, Section>;
  assignmentsMap: Record<string, Assignment>;
}

export default function PeopleView({ course, access, sectionsMap, assignmentsMap }: PeopleViewProps) {
  const sections = Object.values(sectionsMap)
  const assignments = Object.values(assignmentsMap)
  const [filterBySection, setFilterBySection] = useState<string>(ALL_STUDENTS)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false)
  const [invitedStudents, invitedStudentsLoading] = useCourseInvites(course.ID, CoursePermission.CourseStudent)

  const sectionOptions = () => {
    let options = [ALL_STUDENTS, UNASSIGNED]
    sectionsMap && Object.keys(sectionsMap).forEach((sectionID) => {
      options.push(sectionID)
    })
    return options
  }

  const formatOptions = (val: string | undefined) => {
    if (val === ALL_STUDENTS) return ALL_STUDENTS
    if (val === UNASSIGNED) return UNASSIGNED
    return formatSectionInfo(sectionsMap[val], true)
  }

  const filterStudentsBySection = () => {
    // get students based on filtered section
    let studentIDs = []
    if (!filterBySection) {
      studentIDs = course.students ? Object.keys(course.students) : []
    } else {
      if (!course.students) return []
      studentIDs = getStudentsInSection(course.students, filterBySection)
    }
    return studentIDs.map((studentID) => course.students[studentID])
  }

  const handleAddStudent = () => {
    setAddStudentDialogOpen(true)
  }

  const handleExportStudentList = () => {
    exportStudentList(course, invitedStudents)
  }

  const hasNoStudent = () => {
    return (!course.students || Object.keys(course.students).length === 0) && (invitedStudentsLoading || invitedStudents.length === 0)
  }

  return (
    <>
      <AddStudentDialog course={course} open={addStudentDialogOpen} onClose={() => { setAddStudentDialogOpen(false) }} />
      <Stack direction="row" justifyContent="space-between" mb={1} alignItems="center" height={40}>
        <ViewHeader view="people" views={["sections", "assignments", "people", "requests", "settings"]} access={access} />
        <Stack direction="row" alignItems="center" spacing={1}>
          <SelectMenu
            value={filterBySection}
            formatOption={formatOptions}
            options={sectionOptions()}
            onSelect={(val) => setFilterBySection(val)}
            defaultValue={ALL_STUDENTS}
          />
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          {access === CoursePermission.CourseAdmin && <MoreMenu keys={["Add Student", "Export Student List"]} handlers={[handleAddStudent, handleExportStudentList]} />}
        </Stack>
      </Stack >
      {invitedStudents && hasNoStudent() ?
        <Typography mt={3} textAlign="center">No students have joined this course yet.</Typography> :
        (sectionsMap && assignments &&
          <Box overflow="scroll">
            <PeopleTable
              {...{ course, assignments, sectionsMap }}
              students={filterStudentsBySearchQuery(filterStudentsBySection(), searchQuery)}
              invitedStudents={invitedStudents}
            />
          </Box>)
      }
    </>
  );
}
