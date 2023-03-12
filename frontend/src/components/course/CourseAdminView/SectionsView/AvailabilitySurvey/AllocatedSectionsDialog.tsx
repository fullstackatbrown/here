import {
    Button, Dialog, DialogActions, DialogContent, Table,
    TableBody,
    TableCell, TableHead,
    TableRow
} from "@mui/material";
import formatSectionTime from '@util/shared/formatSectionTime';
import { Section } from 'model/section';
import { FC } from "react";

export interface AllocatedSectionsDialogProps {
    open: boolean;
    onClose: () => void;
    results: Record<string, string[]>;
    sections: Record<string, Section>;
}

const AllocatedSectionsDialog: FC<AllocatedSectionsDialogProps> = ({ open, onClose, results, sections }) => {

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
        <DialogContent>
            <>
                <Table aria-label="simple table">
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

            </>
        </DialogContent>
        <DialogActions>
            <Button type="submit" variant="contained">Allocate Sections</Button>
        </DialogActions>
    </Dialog>
};

export default AllocatedSectionsDialog;


