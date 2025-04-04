import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
      <CircularProgress size={40} sx={{ mb: 2 }} />
      <Typography variant="body1" color="text.secondary">{message}</Typography>
    </Box>
  );
};

export default LoadingSpinner;