import TabPanel from '@components/shared/TabPanel';
import {
    Box,
    Button, Dialog, DialogActions, DialogContent,
    DialogTitle,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    Typography
} from "@mui/material";
import { formatSectionResponses, mapToList, TimeCount } from "@util/shared/formatSectionResponses";
import { Survey } from "model/survey";
import { FC, useEffect, useState } from "react";
import SurveyResponsesBarChart from './SurveyResponsesBarChart';

export interface SurveyResponsesDialogProps {
    open: boolean;
    onClose: () => void;
    survey: Survey;
}

enum Mode {
    CHART = 0,
    TABLE = 1
}

const SurveyResponsesDialog: FC<SurveyResponsesDialogProps> = ({ open, onClose, survey }) => {
    const [formattedResponses, setFormattedResponses] = useState<TimeCount[]>([])
    const [numResponses, setNumResponses] = useState(0)
    const [mode, setMode] = useState<Mode>(Mode.CHART);

    const handleChangeMode = (event: React.SyntheticEvent, newValue: number) => {
        setMode(newValue);
    };

    useEffect(() => {
        setNumResponses(Object.keys(survey.responses).length)
        const formattedRes = mapToList(formatSectionResponses(survey.responses))
        setFormattedResponses(formattedRes)
    }, [survey.responses])

    const getPercentage = (count) => Math.round((count / numResponses) * 100)

    const handleAllocateSections = () => {
        // Submit API request to run algorithm
        // will receive the results and a list of sections from backend
    }

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" keepMounted={false}>
        <DialogTitle>{survey.name} (Responses)</DialogTitle>
        <DialogContent >
            <>
                <Typography mb={3}>
                    Total responses: {numResponses}
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={mode} onChange={handleChangeMode}>
                        <Tab label="Chart" />
                        <Tab label="Table" />
                    </Tabs>
                </Box>
                <TabPanel value={mode} index={0} >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        minWidth: "50%",
                        minHeight: 300,
                    }}
                    >
                        <SurveyResponsesBarChart formattedResponses={formattedResponses} numResponses={numResponses} />
                    </Box>
                </TabPanel>
                <TabPanel value={mode} index={1}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell align="right"># Students Available</TableCell>
                                <TableCell align="right">% Students Available</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {formattedResponses.map((response) => (
                                <TableRow
                                    key={response.time}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {response.time}
                                    </TableCell>
                                    <TableCell align="right">{response.count}</TableCell>
                                    <TableCell align="right">{getPercentage(response.count)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabPanel>

            </>
        </DialogContent>
        <DialogActions>
            <Button type="submit" variant="contained" onClick={handleAllocateSections}>Allocate Sections</Button>
        </DialogActions>

    </Dialog >
};

export default SurveyResponsesDialog;


