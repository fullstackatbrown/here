import React, { FC } from "react";
import { Box, Card, IconButton, Paper, Stack, Typography } from "@mui/material";
import formatSectionTime from "@util/shared/formatSectionTime";
import CreateIcon from "@mui/icons-material/Create";
import ClearIcon from "@mui/icons-material/Clear";
import { Section } from "model/section";
import CreateEditSectionDialog from "./CreateEditSectionDialog";

export interface SectionCardProps {
  section: Section;
}

/**
 * SectionCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const SectionCard: FC<SectionCardProps> = ({ section }) => {
  const [editSectionDialog, setEditSectionDialog] = React.useState(false);
  const startTime = new Date(section.startTime);
  const endTime = new Date(section.endTime);

  const handleDeleteSection = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const confirmed = confirm("Are you sure you want to delete this section?");
  }

  const handleEditSection = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setEditSectionDialog(true);
  }

  const handleCloseEditSectionDialog = () => {
    setEditSectionDialog(false)
  }

  return (
    <>
      <CreateEditSectionDialog open={editSectionDialog} onClose={handleCloseEditSectionDialog} section={section} />
      <Card sx={{ ':hover': { boxShadow: 2 } }} variant={"outlined"}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" px={2.5} py={2} alignItems={"center"}>
          <Stack>
            <Typography variant="body1" noWrap>
              {formatSectionTime(startTime, endTime)}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ color: 'text.disabled' }}>
              <Typography variant="body1" fontWeight={400}>
                Location: {section.location}
              </Typography>
              <Typography variant="body1" fontWeight={400}>
                Capacity: {section.capacity}
              </Typography>
              <Typography variant="body1" fontWeight={400}>
                {/* Registered: {section.enrollment} */}
              </Typography>
            </Stack>
          </Stack>
          <Stack display={"flex"} direction="row" spacing={4}>
            <div>
              <IconButton onClick={handleEditSection}>
                <CreateIcon />
              </IconButton >
              <IconButton onClick={handleDeleteSection}>
                <ClearIcon />
              </IconButton>
            </div>
          </Stack>
        </Box>
      </Card>
    </>
  );
};

export default SectionCard;
