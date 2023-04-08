import { Stack, Typography } from "@mui/material";
import { Course } from "model/course";
import PeopleTable from "./PeopleTable";
import { useSections } from "api/section/hooks";
import SelectMenu from "@components/shared/SelectMenu/SelectMenu";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import { Section } from "model/section";
import { useEffect, useState } from "react";
import listToMap from "@util/shared/listToMap";
import getStudentsInSection, { ALL_STUDENTS, UNASSIGNED } from "@util/shared/getStudentsInSection";

export interface PeopleViewProps {
  course: Course;
}

export default function PeopleView({ course }: PeopleViewProps) {
  const [sections, sectionsLoading] = useSections(course.ID)
  const [sectionsMap, setSectionsMap] = useState<Record<string, Section>>({})
  const [filterBySection, setFilterBySection] = useState<string>(ALL_STUDENTS)

  useEffect(() => {
    sections && setSectionsMap(listToMap(sections) as Record<string, Section>)
  }, [sections])

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

  const getStudents = () => {
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

  return (
    <>
      <Stack direction="row" justifyContent="space-between" mb={1} alignItems="center">
        <Typography variant="h6" fontWeight={600}>
          People
        </Typography>
        <SelectMenu
          value={filterBySection}
          formatOption={formatOptions}
          options={sectionOptions()}
          onSelect={(val) => setFilterBySection(val)}
        />
      </Stack >
      <PeopleTable students={getStudents()} />
    </>
  );
}
