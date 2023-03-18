import {
    Table,
    TableBody,
    TableCell, TableHead,
    TableRow
} from "@mui/material";
import { Section } from 'model/section';
import { FC } from "react";
import { red } from '@mui/material/colors';
import formatSectionTime from "@util/shared/formatTime";

export interface AllocatedSectionsTableProps {
    results: Record<string, string[]>;
    sections: Record<string, Section>;
}

const AllocatedSectionsTable: FC<AllocatedSectionsTableProps> = ({ results, sections }) => {

    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>Section Time</TableCell>
                <TableCell align="right">Location</TableCell>
                <TableCell align="right">Students/Capacity</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {Object.keys(results).map((sectionID) => {
                const section = sections[sectionID]
                const numStudents = results[sectionID].length
                return <TableRow
                    key={formatSectionTime(section.day, section.startTime, section.endTime)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell>
                        {formatSectionTime(section.day, section.startTime, section.endTime)}
                    </TableCell>
                    <TableCell align="right">
                        {section.location}
                    </TableCell>
                    <TableCell align="right" sx={{ color: numStudents > section.capacity ? red[500] : "default" }}>{numStudents} / {section.capacity}</TableCell>
                </TableRow>
            }
            )}
        </TableBody>
    </Table>

};

export default AllocatedSectionsTable;


