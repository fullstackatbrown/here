import { Box, Button, Chip, createTheme, Stack, ThemeProvider, Typography } from "@mui/material";
import { Course } from "model/general";

export interface GradeOptionsProps {
  course: Course;
}

const theme = createTheme({
  palette: {
    completed: {
      main: '#D7E8D4',
      contrastText: '#0C3905',
    },
    incomplete: {
      main: '#F6E0DB',
      contrastText: '#621B16',
    },
    ungraded: {
      main: '#E0E0E0',
      contrastText: '#4F4F4F',
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    completed: Palette['primary'];
    incomplete: Palette['primary'];
    ungraded: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    completed?: PaletteOptions['primary'];
    incomplete?: PaletteOptions['primary'];
    ungraded?: PaletteOptions['primary'];
  }
}

// Update the Button's color prop options
declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    completed: true;
    incomplete: true;
    ungraded: true;
  }
}

export default function GradeOptions(props: GradeOptionsProps) {
  return (
    <>
      <Typography variant="h6" fontWeight={600}>
        Grade Options
      </Typography>
      <Box height={100} my={1}>

        <ThemeProvider theme={theme}>
          <Stack direction="row" spacing={2}>
            <Chip label="Completed" color="completed" />
            <Chip label="Incomplete" color="incomplete" />
            <Chip label="Ungraded" color="ungraded" />
          </Stack>
        </ThemeProvider>
      </Box>
    </>
  );
}
