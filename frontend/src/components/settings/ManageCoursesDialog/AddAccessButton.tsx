import { ClickAwayListener, Collapse, IconButton, Input, Stack } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { useForm } from "react-hook-form";
import { watch } from "fs";
import toast from "react-hot-toast";
import CourseAPI from "api/course/api";
import { handleBadRequestError } from "@util/errors";
import { Course, SinglePermissionRequest } from "model/course";
import { CoursePermission } from "model/user";

interface AddAccessButtonProps {
    course: Course;
    access: CoursePermission;
}

type FormData = {
    email: string
};

const AddAccessButton: FC<AddAccessButtonProps> = ({ course, access }) => {
    const [showAddAccessTextfield, setShowAddAccessTextfield] = useState(false)
    const AddAccessButtonRef = useRef(null);

    const { register, handleSubmit, control, reset, watch, formState: { } } = useForm<FormData>({});

    useEffect(() => {
        // needed to ensure that autofocus is applied after the AddAccessButton is rendered
        if (showAddAccessTextfield && AddAccessButtonRef.current) {
            AddAccessButtonRef.current.focus();
        }
    }, [showAddAccessTextfield]);

    const onSubmit = handleSubmit(async data => {
        const permissions: SinglePermissionRequest[] = [{ email: data.email, permission: access }]
        toast.promise(CourseAPI.addPermission(course.ID, permissions), {
            loading: "Adding permission...",
            success: "Added permission!",
            error: (err) => handleBadRequestError(err),
        })
            .then(() => {
                reset()
                AddAccessButtonRef.current.blur();
                setShowAddAccessTextfield(false)
            })
            .catch(() => { })
    })

    return (
        <ClickAwayListener
            onClickAway={() => {
                if (watch("email") === "") setShowAddAccessTextfield(false)
            }}>
            <Stack direction="row" alignItems="center">
                <IconButton size="small" onClick={() => setShowAddAccessTextfield(true)} sx={{ padding: 0.3 }}>
                    <AddIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Collapse orientation="horizontal" in={showAddAccessTextfield}>
                    <form onSubmit={onSubmit}>
                        <Input
                            {...register("email")}
                            placeholder="Enter user email"
                            disableUnderline
                            style={{
                                fontSize: 14,
                                paddingLeft: 2,
                                width: 230,
                            }}
                            inputRef={AddAccessButtonRef}
                        />
                    </form>
                </Collapse>
            </Stack>
        </ClickAwayListener>
    )
}

export default AddAccessButton;