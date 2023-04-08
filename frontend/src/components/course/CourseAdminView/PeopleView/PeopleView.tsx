import { Autocomplete, Box, Collapse, IconButton, Input, Stack, TextField, Typography } from "@mui/material";
import { Course } from "model/course";
import PeopleTable from "./PeopleTable";
import { useSections } from "api/section/hooks";
import SelectMenu from "@components/shared/SelectMenu/SelectMenu";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import { Section } from "model/section";
import { useEffect, useRef, useState } from "react";
import listToMap from "@util/shared/listToMap";
import SearchIcon from '@mui/icons-material/Search';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import getStudentsInSection, { ALL_STUDENTS, UNASSIGNED } from "@util/shared/getStudentsInSection";

export interface PeopleViewProps {
  course: Course;
}

export default function PeopleView({ course }: PeopleViewProps) {
  const [sections, sectionsLoading] = useSections(course.ID)
  const [sectionsMap, setSectionsMap] = useState<Record<string, Section>>(undefined)
  const [filterBySection, setFilterBySection] = useState<string>(ALL_STUDENTS)
  const [showSearchbar, setShowSearchbar] = useState<boolean>(false)
  const searchBarRef = useRef(null);

  useEffect(() => {
    // needed to ensure that autofocus is applied after the searchbar is rendered
    if (showSearchbar && searchBarRef.current) {
      searchBarRef.current.focus();
    }
  }, [showSearchbar]);

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
        <Stack direction="row" alignItems="center">
          <SelectMenu
            value={filterBySection}
            formatOption={formatOptions}
            options={sectionOptions()}
            onSelect={(val) => setFilterBySection(val)}
          />
          <ClickAwayListener onClickAway={() => setShowSearchbar(false)}>
            <Stack direction="row" alignItems="center">
              <IconButton size="small" onClick={() => setShowSearchbar(true)}>
                <SearchIcon sx={{ fontSize: 18 }} color="primary" />
              </IconButton>
              <Collapse orientation="horizontal" in={showSearchbar}>
                <Input
                  placeholder="Type to search"
                  disableUnderline
                  style={{
                    fontSize: 14,
                    padding: 0,
                  }}
                  inputRef={searchBarRef}
                />
              </Collapse>
            </Stack>
          </ClickAwayListener>

        </Stack>
      </Stack >
      {sectionsMap && <PeopleTable students={getStudents()} sectionsMap={sectionsMap} />}
    </>
  );
}
