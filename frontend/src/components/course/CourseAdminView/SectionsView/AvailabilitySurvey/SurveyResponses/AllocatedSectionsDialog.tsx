import {
    Button, Dialog, DialogActions, DialogContent, Table,
    TableBody,
    TableCell, TableHead,
    TableRow
} from "@mui/material";
import formatSectionTime from '@util/shared/formatSectionTime';
import { Section } from 'model/section';
import { FC } from "react";

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
                <TableCell align="right">Capacity</TableCell>
                <TableCell align="right"># Students</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {Object.keys(results).map((sectionID) => {
                const section = sections[sectionID];
                return <TableRow
                    key={formatSectionTime(section.day, section.startTime, section.endTime)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        {section.location}
                    </TableCell>
                    <TableCell align="right">{section.capacity}</TableCell>
                    <TableCell align="right">{results[sectionID].length}</TableCell>
                </TableRow>
            }
            )}
        </TableBody>
    </Table>

};

export default AllocatedSectionsTable;


