import AddIcon from '@mui/icons-material/Add';
import { ClickAwayListener, Collapse, IconButton, Input, Stack } from "@mui/material";
import { Errors, handleBadRequestError } from "@util/errors";
import { validateEmail } from '@util/shared/string';
import CourseAPI from "api/course/api";
import { Course } from "model/course";
import { CoursePermission } from "model/user";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface AddPermissionButtonProps {
    course: Course;
    access: CoursePermission;
    successCallback?: (emailAdded: string[]) => void;
    errorsCallback?: (errors: Record<string, string>) => void;
    autoFocus?: boolean;
    multiline?: boolean;
    placeholder?: string;
}

type FormData = {
    email: string
};

const AddPermissionButton: FC<AddPermissionButtonProps> = ({ course, access, successCallback, errorsCallback, autoFocus = false, multiline = false, placeholder = "Enter user email" }) => {
    const [showAddAccessTextfield, setShowAddAccessTextfield] = useState(autoFocus)
    const AddAccessButtonRef = useRef(null);

    const { register, handleSubmit, reset, watch, formState: { } } = useForm<FormData>({});

    useEffect(() => {
        // needed to ensure that autofocus is applied after the AddAccessButton is rendered
        if (showAddAccessTextfield && AddAccessButtonRef.current) {
            AddAccessButtonRef.current.focus();
        }
    }, [showAddAccessTextfield]);

    const onSubmit = handleSubmit(async (data) => {
        if (data.email === "") {
            toast.error("Must enter a email");
        }
        const emails = data.email.split("\n");

        if ((emails.length > 1) && (access === CoursePermission.CourseStudent)) {
            bulkAddStudents(emails);
            return;
        }

        if (validateEmail(data.email) === false) {
            toast.error("Invalid email");
            return;
        }
        if (access === CoursePermission.CourseStudent) {
            toast.promise(CourseAPI.addStudent(course.ID, data.email), {
                loading: "Adding student...",
                success: "Student added!",
                error: Errors.UNKNOWN,
            })
                .then(() => {
                    successCallback && successCallback([data.email]);
                    reset();
                })
                .catch((err) => {
                    errorsCallback && errorsCallback(err.response?.data?.errors);
                    reset()
                })
        } else {
            toast.promise(CourseAPI.addPermission(course.ID, data.email, access), {
                loading: "Adding permission...",
                success: "Added permission!",
                error: (err) => handleBadRequestError(err),
            })
                .then(() => {
                    reset()
                    AddAccessButtonRef.current.blur();
                    setShowAddAccessTextfield(false)
                })
                .catch(() => { reset() })
        }
    })

    const bulkAddStudents = (emails: string[]) => {
        for (const email of emails) {
            if (validateEmail(email) === false) {
                toast.error("Invalid email: " + email);
                return;
            }
        }
        toast.promise(CourseAPI.bulkAddStudent(course.ID, emails), {
            loading: "Adding students...",
            success: "Students added!",
            error: Errors.UNKNOWN,
        })
            .then(() => {
                successCallback && successCallback(emails);
                reset();
            })
            .catch((err) => {
                successCallback && successCallback(err.response?.data?.success)
                errorsCallback && errorsCallback(err.response?.data?.errors)
                reset()
            })
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            // Submit form when Enter key is pressed without Shift key
            onSubmit();
        }
    };

    return (
        <ClickAwayListener
            onClickAway={() => {
                if (watch("email") === "") setShowAddAccessTextfield(false)
            }}>
            <Stack direction="row" alignItems="start">
                <IconButton size="small" onClick={() => setShowAddAccessTextfield(true)} sx={{ padding: 0.5 }}>
                    <AddIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Collapse orientation="horizontal" in={showAddAccessTextfield}>
                    <form onSubmit={onSubmit}>
                        <Input
                            {...register("email")}
                            placeholder={placeholder}
                            disableUnderline
                            style={{
                                fontSize: 14,
                                paddingLeft: 2,
                                paddingTop: 0.7,
                                width: 230,
                            }}
                            onKeyDown={handleKeyDown}
                            multiline={multiline}
                            inputRef={AddAccessButtonRef}
                        />
                    </form>
                </Collapse>
            </Stack>
        </ClickAwayListener>
    )
}

export default AddPermissionButton;