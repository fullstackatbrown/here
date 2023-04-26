import StudentGradesTable from "@components/course/CourseStudentView/Home/StudentGradesTable";
import SelectMenu from "@components/shared/Menu/SelectMenu";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import formatSectionInfo from "@util/shared/formatSectionInfo";
import { UNASSIGNED } from "@util/shared/getStudentsInSection";
import AuthAPI from "api/auth/api";
import CourseAPI from "api/course/api";
import { Assignment } from "model/assignment";
import { Course } from "model/course";
import { Section } from "model/section";
import { User } from "model/user";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface StudentDialogProps {
    course: Course;
    assignments: Assignment[];
    sectionsMap: Record<string, Section>;
    studentID: string;
    open: boolean;
    onClose: () => void;
}

const StudentDialog: FC<StudentDialogProps> = ({ course, studentID, assignments, sectionsMap, open, onClose }) => {
    const [student, setStudent] = useState<User | undefined>(undefined);
    const defaultSectionID = () => student?.defaultSections?.[course.ID]
    const [selectedSection, setSelectedSection] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (studentID && studentID != "") {
            AuthAPI.getUserById(studentID)
                .then(res => {
                    setStudent(res);
                })
        }
    }, [studentID]);

    const handleOnClose = () => {
        onClose();
        setSelectedSection(undefined);
        setStudent(undefined);
    };


    const sectionOptions = () => {
        let options = [UNASSIGNED]
        sectionsMap && Object.keys(sectionsMap).forEach((sectionID) => {
            options.push(sectionID)
        })
        return options
    }

    const formatOptions = (val: string | undefined) => {
        if (val === UNASSIGNED || val === undefined) return UNASSIGNED
        const section = sectionsMap[val] as Section
        const seatsAvail = section.capacity - section.numEnrolled
        const current = val === defaultSectionID()
        return `${formatSectionInfo(section, true)} (${current ? "current" : seatsAvail + " seats available"})`
    }

    const openEditMode = () => {
        setSelectedSection(defaultSectionID())
    }

    const closeEditMode = () => {
        setSelectedSection(undefined)
    }

    const handleChangeDefaultSection = () => {
        if (selectedSection === defaultSectionID()) {
            closeEditMode()
            return
        }

        toast.promise(CourseAPI.assignSection(course.ID, studentID, selectedSection), {
            loading: "Changing section...",
            success: "Section changed!",
            error: (err) => handleBadRequestError(err)
        })
            .then(() => {
                closeEditMode()
                setStudent({ ...student, defaultSections: { ...student?.defaultSections, [course.ID]: selectedSection } })
            })
            .catch()
    }

    return student && <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="md" keepMounted={false}>
        <DialogTitle>{student.displayName} ({student.email})</DialogTitle>
        <DialogContent>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Typography variant="button" fontSize={15} fontWeight={500}>Regular Section:&nbsp;</Typography>
                <Stack direction="row" alignItems="center">
                    {selectedSection !== undefined ?
                        <SelectMenu
                            value={selectedSection}
                            formatOption={formatOptions}
                            options={sectionOptions()}
                            onSelect={(val) => setSelectedSection(val)}
                            defaultValue={defaultSectionID()}
                        />
                        :
                        <Typography color="secondary" variant="button" fontSize={14} mr={1}>
                            {formatSectionInfo(sectionsMap[defaultSectionID()], true) || "Unassigned"}
                        </Typography>
                    }
                    {selectedSection !== undefined ?
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Tooltip title="confirm" placement="bottom">
                                <IconButton sx={{ p: 0.5 }} onClick={handleChangeDefaultSection}>
                                    <CheckIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="discard" placement="bottom">
                                <IconButton sx={{ p: 0.5 }} onClick={closeEditMode}>
                                    <CloseIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        :
                        <Tooltip title={`change section for ${student.displayName}`} placement="bottom">
                            <IconButton sx={{ p: 0.5 }} onClick={openEditMode}>
                                <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>

                    }
                </Stack>
            </Stack>
            <StudentGradesTable {...{ course, student, sectionsMap, assignments }} />
        </DialogContent>
    </Dialog >;
};

export default StudentDialog;


