import ClearIcon from "@mui/icons-material/Clear";
import CreateIcon from "@mui/icons-material/Create";
import { Box, Card, IconButton, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { handleBadRequestError } from "@util/errors";
import { formatSectionTime } from "@util/shared/formatTime";
import SectionAPI from "api/section/api";
import { Section } from "model/section";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import CreateEditSectionDialog from "./CreateEditSectionDialog";

export interface SectionCardProps {
  active: boolean;
  section: Section;
}

/**
 * SectionCard is a clickable card that is apart of the home page section grid. Contains the course title, section title,
 * number of tickets, location, and the ending time.
 */
const SectionCard: FC<SectionCardProps> = ({ section, active }) => {
  const [editSectionDialog, setEditSectionDialog] = useState(false);
  const theme = useTheme();
  const betweenSmalltoMid = useMediaQuery(theme.breakpoints.between("xs", "md"));

  const handleDeleteSection = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const confirmed = confirm("Are you sure you want to delete this section?" +
      (section.numEnrolled > 0 && " This will affect all students who are currently enrolled in the section"))

    if (confirmed) {
      toast
        .promise(SectionAPI.deleteSection(section.courseID, section.ID), {
          loading: "Deleting section...",
          success: "Section deleted!",
          error: (err) => handleBadRequestError(err),
        })
        .catch(() => { });
    }
  };

  const handleEditSection = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setEditSectionDialog(true);
  };

  const handleCloseEditSectionDialog = () => {
    setEditSectionDialog(false);
  };

  return (
    <>
      <CreateEditSectionDialog open={editSectionDialog} onClose={handleCloseEditSectionDialog} section={section} />
      <Card sx={{ ":hover": { boxShadow: 2 } }} variant={"outlined"}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" px={2.5} py={1.5} alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="body2" noWrap>
              {formatSectionTime(section, betweenSmalltoMid)}
            </Typography>
            <Stack
              spacing={{
                xs: 0,
                md: 2.5,
              }}
              direction={{ xs: "column", md: "row" }}
              sx={{
                color: "text.disabled",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={400}
                sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}
              >
                Location: {section.location || "TBD"}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={400}
                sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}
              >
                Enrollment: {section.numEnrolled} / {section.capacity}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="center">
            <IconButton onClick={handleEditSection} size={"small"} disabled={!active}>
              <CreateIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleDeleteSection} size={"small"} disabled={!active}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Card>
    </>
  );
};

export default SectionCard;
