import { useState, useEffect } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, CircularProgress, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageContainer from '../components/common/PageContainer';
import DepartmentList from '../components/departments/DepartmentList';
import { useApi } from '../hooks/useApi';
import { getDepartments, createDepartment } from '../api/departmentsApi';

const DepartmentsPage = () => {
  const { data: departments, loading, error, fetchData } = useApi(getDepartments);
  const [openDialog, setOpenDialog] = useState(false);
  const [departmentCode, setDepartmentCode] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    departmentCode: '',
    departmentName: '',
    general: ''
  });
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  
  const refreshData = () => {
    if (typeof fetchData === 'function') {
      fetchData();
    } else {
      
      window.location.reload();
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setDepartmentCode('');
    setDepartmentName('');
    setFormErrors({
      departmentCode: '',
      departmentName: '',
      general: ''
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const validateForm = () => {
    const errors = {
      departmentCode: '',
      departmentName: '',
      general: ''
    };
    let isValid = true;

    if (!departmentCode.trim()) {
      errors.departmentCode = 'Department code is required';
      isValid = false;
    }

    if (!departmentName.trim()) {
      errors.departmentName = 'Department name is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const showNotification = (message, severity = 'success', duration = 3000) => {
    setNotification({
        open: true,
        message,
        severity
    });

    setTimeout(() => {
        setNotification({ open: false, message: '', severity: '' });
    }, duration);
};

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    try {
      await createDepartment({
        departmentCode,
        departmentName
      });
      
      handleCloseDialog();

      showNotification('Department created successfully');
        
        setTimeout(() => {
          refreshData();
      }, 2000);
    
    } catch (err) {
      console.error('Error creating department:', err);
      
      const newFormErrors = {
        departmentCode: '',
        departmentName: '',
        general: ''
      };
      
      if (err.response) {
        let errorMessage = '';
        
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.statusText) {
          errorMessage = err.response.statusText;
        }
        
        if (errorMessage.includes("required")) {
          if (errorMessage.toLowerCase().includes("code")) {
            newFormErrors.departmentCode = 'Department code is required';
          } else if (errorMessage.toLowerCase().includes("name")) {
            newFormErrors.departmentName = 'Department name is required';
          } else {
            newFormErrors.general = 'All fields are required';
          }
        } else if (errorMessage.includes("already exists")) {
          if (errorMessage.toLowerCase().includes("code")) {
            newFormErrors.departmentCode = 'Department code already exists';
          } else if (errorMessage.toLowerCase().includes("name")) {
            newFormErrors.departmentName = 'Department name already exists';
          } else {
            newFormErrors.general = 'Department already exists';
          }
        } else {
          newFormErrors.general = errorMessage || 'An error occurred while creating the department';
        }
        
        setFormErrors(newFormErrors);
      } else {
        showNotification(err.message || 'Failed to connect to the server', 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };
  
  return (
    <PageContainer title="Departments">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary">
          {departments ? `${departments.length} departments found` : ''}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ borderRadius: 28 }}
          onClick={handleOpenDialog}
        >
          Add Department
        </Button>
      </Box>
      
      <DepartmentList 
        departments={departments} 
        loading={loading} 
        error={error} 
      />
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Department</DialogTitle>
        <DialogContent>
          {formErrors.general && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {formErrors.general}
            </Alert>
          )}
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="departmentCode"
              label="Department Code"
              type="text"
              fullWidth
              value={departmentCode}
              onChange={(e) => setDepartmentCode(e.target.value)}
              error={!!formErrors.departmentCode}
              helperText={formErrors.departmentCode}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              margin="dense"
              id="departmentName"
              label="Department Name"
              type="text"
              fullWidth
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              error={!!formErrors.departmentName}
              helperText={formErrors.departmentName}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} disabled={submitLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={submitLoading}
            startIcon={submitLoading ? <CircularProgress size={20} /> : null}
          >
            {submitLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        key={notification.message}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default DepartmentsPage;