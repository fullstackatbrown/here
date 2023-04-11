import ClearIcon from "@mui/icons-material/Clear";
import CreateIcon from "@mui/icons-material/Create";
import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import { formatSectionTime } from "@util/shared/formatTime";
import SectionAPI from "api/section/api";
import { Section } from "model/section";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import CreateEditSectionDialog from "./CreateEditSectionDialog";
import { handleBadRequestError } from "@util/errors";

export interface SectionCardProps {
  enrollment: number;
  section: Section;
}

/**
 * SectionCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const SectionCard: FC<SectionCardProps> = ({ section, enrollment }) => {
  const [editSectionDialog, setEditSectionDialog] = useState(false);

  const handleDeleteSection = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const confirmed = confirm("Are you sure you want to delete this section?");
    if (confirmed) {
      toast.promise(SectionAPI.deleteSection(section.courseID, section.ID), {
        loading: "Deleting section...",
        success: "Section deleted!",
        error: (err) => handleBadRequestError(err)
      })
        .catch(() => { })
    }
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
        <Box display="flex" flexDirection="row" justifyContent="space-between" px={2.5} py={1.5} alignItems={"center"}>
          <Stack>
            <Typography variant="body2" noWrap>
              {formatSectionTime(section)}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ color: 'text.disabled' }}>
              <Typography variant="body2" fontWeight={400}>
                Location: {section.location || "TBD"}
              </Typography>
              <Typography variant="body2" fontWeight={400}>
                Capacity: {section.capacity}
              </Typography>
              <Typography variant="body2" fontWeight={400}>
                Registered: {enrollment}
              </Typography>
            </Stack>
          </Stack>
          <Stack display={"flex"} direction="row" spacing={4}>
            <div>
              <IconButton onClick={handleEditSection} size={"small"}>
                <CreateIcon fontSize="small" />
              </IconButton >
              <IconButton onClick={handleDeleteSection} size={"small"}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </div>
          </Stack>
        </Box>
      </Card>
    </>
  );
};

export default SectionCard;
