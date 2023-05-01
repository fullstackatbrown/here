import StudentGradesTable from "@components/course/CourseStudentView/Home/StudentGradesTable";
import SelectMenu from "@components/shared/Menu/SelectMenu";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import {
    Backdrop,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Theme,
    Tooltip,
    Typography,
    useMediaQuery
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
    const defaultSectionID = () => student?.defaultSections?.[course.ID] || UNASSIGNED
    const [selectedSection, setSelectedSection] = useState<string | undefined>(undefined); // undefined means not in edit mode
    const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

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

        const newSectionID = selectedSection === UNASSIGNED ? "" : selectedSection

        toast.promise(CourseAPI.assignSection(course.ID, studentID, newSectionID), {
            loading: "Changing section...",
            success: "Section changed!",
            error: (err) => handleBadRequestError(err)
        })
            .then(() => {
                closeEditMode()
                setStudent({ ...student, defaultSections: { ...student?.defaultSections, [course.ID]: newSectionID } })
            })
            .catch()
    }

    return student ?
        <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="md" keepMounted={false}>
            < DialogTitle > {student.displayName}({student.email})</DialogTitle >
            <DialogContent>
                <Stack direction="column" spacing={2}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        alignItems={{ xs: "flex-start", md: "center" }}
                        spacing={{ xs: 0, md: 1 }}
                        justifyContent="space-between"
                    >
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
                                    {defaultSectionID() === UNASSIGNED ? UNASSIGNED : formatSectionInfo(sectionsMap[defaultSectionID()], true)}
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
                    <Stack direction="column" spacing={0.5}>
                        {isXsScreen && <Typography variant="button" fontSize={15} fontWeight={500}>Assignments & Grades</Typography>}
                        <StudentGradesTable {...{ course, student, sectionsMap, assignments }} instructor />
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog > :
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open && !student}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
};

export default StudentDialog;


