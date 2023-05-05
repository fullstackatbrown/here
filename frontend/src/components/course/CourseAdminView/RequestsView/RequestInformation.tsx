import { Box, Stack, Typography } from "@mui/material";
import formatSectionInfo, { formatSectionCapacity } from "@util/shared/formatSectionInfo";
import { formatRequestTime } from "@util/shared/requestTime";
import { Assignment } from "model/assignment";
import { CourseUserData } from "model/course";
import { Section } from "model/section";
import { Swap, SwapStatus } from "model/swap";
import { FC } from "react";


export interface RequestInformationProps {
    request: Swap;
    student: CourseUserData;
    oldSection: Section;
    newSection: Section;
    assignment?: Assignment;
    studentView?: boolean;
}


const RequestInformation: FC<RequestInformationProps> = ({ request, student, oldSection, newSection, assignment, studentView = false }) => {
    const [availableSeats, availableSeatsString] = formatSectionCapacity(newSection, assignment?.ID)
    const pending = request.status === SwapStatus.Pending

    const formatStatus = () => {
        let additionalInfo = ""
        if (request.status === SwapStatus.Pending) {
            additionalInfo = `(submitted on ${formatRequestTime(request.requestTime, true)})`

            if (!student) {
                additionalInfo += " [No Longer Enrolled; Please Archive]"
            }
        } else {
            additionalInfo = `(${formatRequestTime(request.handledTime, true)})`
            if (request.handledBy === "system") {
                additionalInfo += " [Automatic]"
            }
        }

        return request.status + " " + additionalInfo
    }

    const emphasize = (text: string) =>
        <Box component="span" color={pending && !studentView ? "text.primary" : "inherit"}>{text}</Box>

    const information = {
        "Type": assignment ? `one time` : "permanent",
        "Old Section": emphasize(formatSectionInfo(oldSection, true)),
        "New Section":
            <>
                {emphasize(formatSectionInfo(newSection, true))}
                {pending && !studentView && <Box component="span" color={availableSeats <= 0 ? "error.main" : "text.primary"}>
                    &nbsp;({availableSeatsString})
                </Box>
                }
            </>,
        "Reason": request.reason,
        "Status": formatStatus(),
    }

    return <Stack direction="column" spacing={1}>
        {Object.keys(information).map((key) => {
            return <Stack direction="row" key={key}>
                <Box minWidth={100}>
                    <Typography color="secondary" fontSize={14}>{key}</Typography>
                </Box>
                <Typography color="secondary" fontSize={14}>
                    {information[key]}
                </Typography>
            </Stack>
        })}
    </Stack>
}

export default RequestInformation