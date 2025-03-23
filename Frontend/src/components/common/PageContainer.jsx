import { Box, Paper, Typography, useTheme } from '@mui/material';

const PageContainer = ({ title, children }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          color: theme.palette.text.primary 
        }}
      >
        {title}
      </Typography>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default PageContainer;