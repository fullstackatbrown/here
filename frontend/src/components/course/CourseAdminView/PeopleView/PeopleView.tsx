import SelectMenu from "@components/shared/Menu/SelectMenu";
import SearchBar from "@components/shared/SearchBar/SearchBar";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Stack, Typography } from "@mui/material";
import { exportStudentList } from "@util/shared/export";
import getStudentsInSection, { ALL_STUDENTS, UNASSIGNED } from "@util/shared/getStudentsInSection";
import formatSectionInfo from "@util/shared/section";
import { filterStudentsBySearchQuery } from "@util/shared/user";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { CoursePermission, User } from "model/user";
import { useMemo, useState } from "react";
import MoreMenu from "../../../shared/Menu/MoreMenu";
import AdminViewHeader from "../AdminViewHeader";
import AddStudentDialog from "./AddStudentDialog";
import PeopleTable from "./PeopleTable/PeopleTable";
import PeopleTableForStudents from "./PeopleTable/PeopleTableForStudents";

export interface PeopleViewProps {
  course: Course;
  access: CoursePermission;
  student?: User;
  sectionsMap: Record<string, Section>;
  assignmentsMap: Record<string, Assignment>;
  invitedStudents?: string[];
}

export default function PeopleView({ course, access, sectionsMap, assignmentsMap, invitedStudents = [], student }: PeopleViewProps) {
  const assignments = useMemo(() => Object.values(assignmentsMap), [assignmentsMap])
  const [filterBySection, setFilterBySection] = useState<string>(ALL_STUDENTS)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false)

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
    exportStudentList(course, sectionsMap, invitedStudents)
  }

  const hasNoStudent = () => {
    return (!course.students || Object.keys(course.students).length === 0) && (invitedStudents.length === 0)
  }

  return (
    <>
      <AddStudentDialog course={course} open={addStudentDialogOpen} onClose={() => { setAddStudentDialogOpen(false) }} />
      <AdminViewHeader
        view="people"
        access={access}
        endElement={
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            <SelectMenu
              value={filterBySection}
              formatOption={formatOptions}
              options={sectionOptions()}
              onSelect={(val) => setFilterBySection(val)}
              defaultValue={ALL_STUDENTS}
              startIcon={<FilterAltOutlinedIcon sx={{ mr: -.5 }} />}
            />
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            {access === CoursePermission.CourseAdmin && <MoreMenu keys={["Add Student", "Export Student List"]} handlers={[handleAddStudent, handleExportStudentList]} />}
          </Stack>
        }
      />

      {hasNoStudent() ?
        <Typography mt={3} textAlign="center">No students have joined this course yet.</Typography> :

        (access === CoursePermission.CourseStudent ?
          <PeopleTableForStudents
            {...{ course, sectionsMap }}
            students={filterStudentsBySearchQuery(filterStudentsBySection(), searchQuery)}
            currentUser={student}
          /> :
          <PeopleTable
            {...{ course, assignments, sectionsMap }}
            students={filterStudentsBySearchQuery(filterStudentsBySection(), searchQuery)}
            invitedStudents={(filterBySection === UNASSIGNED || filterBySection === ALL_STUDENTS) ? invitedStudents : []}
            access={access}
          />

        )

      }
    </>
  );
}
