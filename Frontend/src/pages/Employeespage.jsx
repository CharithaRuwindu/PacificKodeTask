import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageContainer from '../components/common/PageContainer';
import EmployeeList from '../components/employees/EmployeeList';
import EmployeeForm from '../components/employees/EmployeeForm';
import { useApi } from '../hooks/useApi';
import { getEmployees, deleteEmployee } from '../api/employeesApi';

const EmployeesPage = () => {
  const { data: employees, loading, error, refetch } = useApi(getEmployees);
  
  const [localEmployees, setLocalEmployees] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  useEffect(() => {
    if (employees) {
      setLocalEmployees(employees);
    }
  }, [employees]);
  
  const handleDeleteEmployee = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      
      setLocalEmployees(prevEmployees => 
        prevEmployees.filter(emp => emp.employeeId !== employeeId)
      );
      
      if (typeof refetch === 'function') {
        refetch();
      }
      
      setAlertMessage('Employee deleted successfully');
      setAlertOpen(true);
      
      return true;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  };
  
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedEmployee(null);
  };
  
  const handleAddEmployee = () => {
    setSelectedEmployee(null); 
    setEditModalOpen(true);
  };

  const refreshData = () => {
    if (typeof fetchData === 'function') {
      fetchData();
    } else {
      
      window.location.reload();
    }
  };
  
  const handleEmployeeSaved = () => {
    if (typeof refetch === 'function') {
        refetch();
    }
    
    const successMessage = selectedEmployee 
      ? `${selectedEmployee.firstName} ${selectedEmployee.lastName} updated successfully` 
      : 'Employee added successfully';
    
    setAlertMessage(successMessage);
    setTimeout(() => {
      refreshData();
  }, 1500);
    setAlertOpen(true);
  };
  
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };
  
  return (
    <PageContainer title="Employees">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ borderRadius: 28 }}
          onClick={handleAddEmployee}
        >
          Add Employee
        </Button>
      </Box>
      
      <EmployeeList 
        employees={localEmployees || employees}
        loading={loading}
        error={error}
        onDeleteEmployee={handleDeleteEmployee}
        onEditEmployee={handleEditEmployee}
      />
      
      <Dialog 
        open={editModalOpen} 
        onClose={handleCloseEditModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        </DialogTitle>
        <DialogContent>
          <EmployeeForm 
            employee={selectedEmployee}
            onClose={handleCloseEditModal}
            onSuccess={handleEmployeeSaved}
          />
        </DialogContent>
      </Dialog>
      
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default EmployeesPage;