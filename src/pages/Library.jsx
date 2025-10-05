import { Box, Typography } from "@mui/material";

const Library = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bibliotek
      </Typography>
      <Typography variant="body1">
        Här kan du se dina sparade låtar, album och artister.
      </Typography>
    </Box>
  );
};

export default Library;
