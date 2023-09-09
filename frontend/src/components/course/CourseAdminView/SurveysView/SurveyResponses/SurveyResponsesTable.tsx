import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    styled
} from "@mui/material";
import MuiTableCell, { TableCellProps } from "@mui/material/TableCell";
import { grey, red } from "@mui/material/colors";
import { OptionDetails } from "@util/shared/survey";
import { CourseUserData } from "model/course";
import { SurveyOption } from 'model/survey';
import React, { FC } from "react";

export interface SurveyResponsesTableProps {
    formattedResponses: OptionDetails[];
    students: Record<string, CourseUserData>;
}

interface StyledTableCellProps extends TableCellProps {
    disabled?: boolean;
}

const TableCell = styled(MuiTableCell)<StyledTableCellProps>(({ theme, disabled }) => ({
    color: disabled ? grey[500] : "default",
    ":last-of-type": {
        paddingLeft: 0,
        paddingRight: 0,
    },
}))


const SurveyResponsesTable: FC<SurveyResponsesTableProps> = ({ formattedResponses, students }) => {
    return <Table>
        <colgroup>
            <col style={{ width: "35%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "47%" }} />
        </colgroup>
        <TableHead>
            <TableRow>
                <TableCell>Option</TableCell>
                <TableCell>Responses</TableCell>
                <TableCell>Respondants</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {formattedResponses.map((resp) => {
                return (
                    <TableRow key={resp.option}>
                        <TableCell disabled={!resp.optionExists}>
                            {resp.option} {!resp.optionExists && "(deleted)"}
                        </TableCell>
                        <TableCell disabled={!resp.optionExists}>
                            {resp.count}
                        </TableCell>
                        <TableCell disabled={!resp.optionExists}>
                            {resp.students.map(s => students[s] ? students[s].displayName : "[No longer Enrolled]").join(", ")}
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableBody>
    </Table>
};

export default SurveyResponsesTable;


