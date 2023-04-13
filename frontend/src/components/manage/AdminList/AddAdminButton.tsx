import { ClickAwayListener, Collapse, IconButton, Input, Stack, Tooltip } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { useForm } from "react-hook-form";
import { watch } from "fs";
import toast from "react-hot-toast";
import CourseAPI from "api/course/api";
import { handleBadRequestError } from "@util/errors";
import { Course, SinglePermissionRequest } from "model/course";
import { CoursePermission } from "model/user";

interface AddAdminButtonProps {

}

type FormData = {
    email: string
};

const AddAdminButton: FC<AddAdminButtonProps> = ({ }) => {
    const [showAddAccessTextfield, setShowAddAccessTextfield] = useState(false)
    const AddAdminButtonRef = useRef(null);

    const { register, handleSubmit, control, reset, watch, formState: { } } = useForm<FormData>({});

    useEffect(() => {
        // needed to ensure that autofocus is applied after the AddAdminButton is rendered
        if (showAddAccessTextfield && AddAdminButtonRef.current) {
            AddAdminButtonRef.current.focus();
        }
    }, [showAddAccessTextfield]);

    const onSubmit = handleSubmit(async data => {
        // const permissions: SinglePermissionRequest[] = [{ email: data.email, permission: access }]
        // toast.promise(CourseAPI.addPermission(course.ID, permissions), {
        //     loading: "Adding permission...",
        //     success: "Added permission!",
        //     error: (err) => handleBadRequestError(err),
        // })
        //     .then(() => {
        //         reset()
        //         AddAdminButtonRef.current.blur();
        //         setShowAddAccessTextfield(false)
        //     })
        //     .catch(() => { })
    })

    return (
        <ClickAwayListener
            onClickAway={() => {
                if (watch("email") === "") setShowAddAccessTextfield(false)
            }}>
            <Stack direction="row" alignItems="center">
                <Tooltip title="Add Site Admin" placement="right" disableHoverListener={showAddAccessTextfield}>
                    <IconButton onClick={() => setShowAddAccessTextfield(true)} sx={{ padding: 0.8 }}>
                        <AddIcon sx={{ fontSize: 24 }} />
                    </IconButton>
                </Tooltip>
                <Collapse orientation="horizontal" in={showAddAccessTextfield}>
                    <form onSubmit={onSubmit}>
                        <Input
                            {...register("email")}
                            placeholder="Enter user email"
                            disableUnderline
                            style={{
                                fontSize: 15,
                                paddingLeft: 2,
                                width: 250,
                            }}
                            inputRef={AddAdminButtonRef}
                        />
                    </form>
                </Collapse>
            </Stack>
        </ClickAwayListener>
    )
}

export default AddAdminButton;