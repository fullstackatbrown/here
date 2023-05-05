import { Box, Stack, Typography, useTheme } from "@mui/material";
import formatSectionInfo, { formatSectionCapacity } from "@util/shared/formatSectionInfo";
import { formatRequestTime } from "@util/shared/requestTime";
import { Assignment } from "model/assignment";
import { CourseUserData } from "model/course";
import { Section } from "model/section";
import { Swap } from "model/swap";
import { FC } from "react";


export interface RequestInformationProps {
    request: Swap;
    student: CourseUserData;
    oldSection: Section;
    newSection: Section;
    assignment?: Assignment;
}


const RequestInformation: FC<RequestInformationProps> = ({ request, oldSection, newSection, assignment }) => {
    const theme = useTheme();

    const information = {
        "Type": assignment ? `One Time - ${assignment.name}` : "Permanent",
        "Old Section": formatSectionInfo(oldSection, true),
        "New Section": formatSectionInfo(newSection, true),
        "Time": formatRequestTime(request.requestTime, true),
        "Reason": request.reason,
    }

    return <Stack direction="column" spacing={1}>
        {Object.keys(information).map((key) => {
            const [availableSeats, availableSeatsString] = formatSectionCapacity(newSection, assignment?.ID)
            return <Stack direction="row" key={key}>
                <Box minWidth={100}>
                    <Typography color="secondary" fontSize={14}>{key}</Typography>
                </Box>
                <Typography color="secondary" fontSize={14}>
                    {information[key]}
                    {key === "New Section" &&
                        <Box component="span" color={availableSeats <= 0 ? theme.palette.error.main : "inherit"}>
                            &nbsp;({availableSeatsString})
                        </Box>
                    }
                </Typography>
            </Stack>
        })}
    </Stack>
}

export default RequestInformation