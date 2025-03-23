import { useState } from 'react';
import { Grid, Typography, Box, Alert, Snackbar } from '@mui/material';
import EmployeeCard from './EmployeeCard';
import LoadingSpinner from '../common/LoadingSpinner';

const EmployeeList = ({ 
  employees, 
  loading, 
  error, 
  onDeleteEmployee, 
  onEditEmployee 
}) => {
  const [operationError, setOperationError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const handleDelete = async (employeeId) => {
    try {
      if (typeof onDeleteEmployee !== 'function') {
        throw new Error('Delete handler is not properly configured');
      }
      
      await onDeleteEmployee(employeeId);
      setSuccessMessage("Employee successfully deleted");
    } catch (error) {
      console.error("Error deleting employee:", error);
      setOperationError(error.message || "Failed to delete employee");
      throw error;
    }
  };
  
  const handleEdit = (employee) => {
    if (typeof onEditEmployee === 'function') {
      onEditEmployee(employee);
    } else {
      console.warn('Edit handler is not properly configured');
    }
  };
  
  const handleCardError = (error) => {
    console.error("Error in employee card operation:", error);
  };
  
  const handleCloseError = () => {
    setOperationError(null);
  };
  
  const handleCloseSuccess = () => {
    setSuccessMessage(null);
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading employees..." />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading employees: {error}
      </Alert>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No employees found.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {employees.map((employee) => (
          <Grid item key={employee.employeeId} xs={12} sm={6} md={4}>
            <EmployeeCard 
              employee={employee} 
              onDelete={handleDelete}
              onEdit={handleEdit}
              onError={handleCardError}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSuccess} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar> */}
      
      <Snackbar
        open={!!operationError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {operationError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EmployeeList;