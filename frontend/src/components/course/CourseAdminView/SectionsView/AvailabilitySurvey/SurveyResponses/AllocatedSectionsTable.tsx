import {
    Table,
    TableBody,
    TableCell, TableHead,
    TableRow
} from "@mui/material";
import { Section } from 'model/section';
import { FC } from "react";
import { red } from '@mui/material/colors';
import { sortSections } from "@util/shared/sortSectionTime";
import { formatSectionTime } from "@util/shared/formatTime";

export interface AllocatedSectionsTableProps {
    results: Record<string, string[]>;
    sections: Section[];
}

const AllocatedSectionsTable: FC<AllocatedSectionsTableProps> = ({ results, sections }) => {
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>Section Time</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Students/Capacity</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {sortSections(sections).map((section) => {
                // TODO: some sections may not be in the survey
                const numStudents = results[section.ID]?.length || 0
                const time = formatSectionTime(section)
                return <TableRow
                    key={time}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell>
                        {time}
                    </TableCell>
                    <TableCell>
                        {section.location ? section.location : "TBD"}
                    </TableCell>
                    <TableCell sx={{ color: numStudents > section.capacity ? red[500] : "default" }}>
                        {numStudents} / {section.capacity}
                    </TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>

};

export default AllocatedSectionsTable;


