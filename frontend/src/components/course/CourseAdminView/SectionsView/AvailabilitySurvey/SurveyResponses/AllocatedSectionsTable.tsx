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
import { sortSections } from "@util/shared/sortSectionTime";

export interface AllocatedSectionsTableProps {
    results: Record<string, string[]>;
    sections: Section[];
}

const AllocatedSectionsTable: FC<AllocatedSectionsTableProps> = ({ results, sections }) => {

    // const sectionsMap = sections.reduce((acc, section) => {
    //     acc[section.ID] = section
    //     return acc
    // }, {} as Record<string, Section>)

    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>Section Time</TableCell>
                <TableCell align="right">Location</TableCell>
                <TableCell align="right">Students/Capacity</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {sortSections(sections).map((section) => {
                const numStudents = results[section.ID].length
                return <TableRow
                    key={formatSectionTime(section.day, section.startTime, section.endTime)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell>
                        {formatSectionTime(section.day, section.startTime, section.endTime)}
                    </TableCell>
                    <TableCell align="right">
                        {section.location ? section.location : "TBD"}
                    </TableCell>
                    <TableCell align="right" sx={{ color: numStudents > section.capacity ? red[500] : "default" }}>
                        {numStudents} / {section.capacity}
                    </TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>

};

export default AllocatedSectionsTable;


