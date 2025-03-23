import { Grid, Typography, Box, Alert } from '@mui/material';
import DepartmentCard from './DepartmentCard';
import LoadingSpinner from '../common/LoadingSpinner';

const DepartmentList = ({ departments, loading, error }) => {
  if (loading) {
    return <LoadingSpinner message="Loading departments..." />;
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading departments. Please try again later.
      </Alert>
    );
  }
  
  if (!departments || departments.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No departments found.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Grid container spacing={3}>
      {departments.map((department) => (
        <Grid item key={department.id} xs={12} sm={6} md={4}>
          <DepartmentCard department={department} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DepartmentList;