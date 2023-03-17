import { Button, Stack, Typography } from "@mui/material";
import { useSections } from "@util/section/hooks";
import { Course } from "model/course";
import { FC, useEffect, useState } from "react";
import AvailabilitySurvey from "./AvailabilitySurvey/AvailabilitySurvey";
import CreateEditSectionDialog from "./Sections/CreateEditSectionDialog";
import SectionCard from "./Sections/SectionCard";

export interface SectionsViewProps {
  course: Course;
}

const SectionsView: FC<SectionsViewProps> = ({ course }) => {
  const [createSectionDialog, setcreateSectionDialog] = useState(false);
  const [sections, loading] = useSections(course.ID);

  // useEffect(() => {
  //   // if (router.isReady && !queueLoading && !queue) {
  //   //     router.push("/")
  //   //         .then(() => toast.error("We couldn't find the queue you were looking for."));
  //   // }
  // }, [course, sections, loading]);

  const getEnrollment = (sectionId: string) => {
    // loop through courses.students and count the number of students whose value is section id
    if (!course.students) return 0;
    let count = 0;
    Object.keys(course.students).forEach((studentId) => {
      if (course.students[studentId] === sectionId) {
        count++;
      }
    });
    return count;
  }

  return (
    <>
      <CreateEditSectionDialog open={createSectionDialog} onClose={() => setcreateSectionDialog(false)} courseID={course.ID}
      />
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          Sections
        </Typography>
        <Button onClick={() => setcreateSectionDialog(true)}>
          + New
        </Button>
      </Stack>
      <Stack direction="column" spacing={2} mb={5}>
        {sections && sections.map((s) => <SectionCard section={s} enrollment={getEnrollment(s.ID)} />)}
      </Stack>
      {sections && sections.length > 0 && <AvailabilitySurvey course={course} />}
    </>
  );
}

export default SectionsView;