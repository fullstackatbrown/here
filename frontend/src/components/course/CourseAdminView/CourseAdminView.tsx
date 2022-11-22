import { Course, Section } from "model/general";
import CourseHeader from "../CourseHeader"

export interface CourseAdminViewProps {
      course: Course;
}

export function CourseAdminView(props: CourseAdminViewProps) {
      return <div>
            <CourseHeader course={props.course} />
      </div>
}