import { 
    Card, 
    CardContent, 
    Typography, 
    CardActions, 
    Button, 
    Box,
    Chip,
    useTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Alert,
    TextField
  } from '@mui/material';
  import BusinessIcon from '@mui/icons-material/Business';
  import CodeIcon from '@mui/icons-material/Code';
  import { useState } from 'react';
  import { deleteDepartment, updateDepartment } from '../../api/departmentsApi';
  
  const DepartmentCard = ({ department, onDelete, onUpdate }) => {
    const theme = useTheme();
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    const [editData, setEditData] = useState({
      departmentName: department.departmentName,
      departmentCode: department.departmentCode
    });
    
    const [validationErrors, setValidationErrors] = useState({
      departmentName: '',
      departmentCode: ''
    });
  
    const handleDeleteClick = () => {
      setOpenConfirm(true);
    };
  
    const handleEditClick = () => {
      setEditData({
        departmentName: department.departmentName,
        departmentCode: department.departmentCode
      });
      setValidationErrors({
        departmentName: '',
        departmentCode: ''
      });
      setError(null);
      setOpenEdit(true);
    };
  
    const handleCloseDialog = () => {
      setOpenConfirm(false);
      setOpenEdit(false);
    };
  
    const handleConfirmDelete = async () => {
      setIsDeleting(true);
      try {
        await deleteDepartment(department.id);
        
        setOpenConfirm(false);
        
        setSuccessMessage('Department successfully deleted');
        setShowSuccessAlert(true);    

        if (onDelete) onDelete(department.id);
        
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        
      } catch (err) {
        console.error('Error deleting department:', err);
        setError(err.response?.data || err.message || 'Failed to delete department');
      } finally {
        setIsDeleting(false);
      }
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditData({
        ...editData,
        [name]: value
      });
      
      if (validationErrors[name]) {
        setValidationErrors({
          ...validationErrors,
          [name]: ''
        });
      }
    };
  
    const validateForm = () => {
      let isValid = true;
      const newErrors = { ...validationErrors };
      
      if (!editData.departmentName || editData.departmentName.trim() === '') {
        newErrors.departmentName = 'Department name is required';
        isValid = false;
      }
      
      if (!editData.departmentCode || editData.departmentCode.trim() === '') {
        newErrors.departmentCode = 'Department code is required';
        isValid = false;
      }
      
      setValidationErrors(newErrors);
      return isValid;
    };
  
    const handleSubmitEdit = async () => {
      if (!validateForm()) {
        return;
      }
      
      setIsUpdating(true);
      setError(null);
      
      try {
        const updatedDeptData = {
          departmentCode: editData.departmentCode.trim(),
          departmentName: editData.departmentName.trim()
        };
        
        await updateDepartment(department.id, updatedDeptData);
        
        setOpenEdit(false);
        setSuccessMessage('Department successfully updated');
        setShowSuccessAlert(true);
  
            if (typeof fetchData === 'function') {
              fetchData();
            } else {
                setTimeout(() => {
                    window.location.reload();
                }, 1500);      
            }
          
        
        if (onUpdate) onUpdate({
          ...department,
          departmentCode: updatedDeptData.departmentCode,
          departmentName: updatedDeptData.departmentName
        });
      } catch (err) {
        console.error('Error updating department:', err);
        
        if (err.message && (
          err.message.includes("Department Code already exists") ||
          err.message.includes("Department Name already exists") ||
          err.message.includes("Department Code or Name already exists")
        )) {
          setError(err.message);
        } else {
          setError(err.response?.data || err.message || 'Failed to update department');
        }
      } finally {
        setIsUpdating(false);
      }
    };
  
    const handleAlertClose = () => {
      setError(null);
      setShowSuccessAlert(false);
    };
    
    return (
      <>
        <Card 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            minWidth: { xs: '100%', sm: '350px' },
            width: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[6],
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                color: theme.palette.primary.main
              }}
            >
              <BusinessIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2">{department.departmentName}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CodeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <Typography variant="body2" color="text.secondary">
                Code: {department.departmentCode}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Chip 
                label={`ID: ${department.id.substring(0, 8)}...`} 
                size="small" 
                sx={{ 
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.dark,
                }} 
              />
            </Box>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={handleEditClick}>Edit</Button>
            <Button 
              size="small" 
              color="error" 
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </CardActions>
        </Card>
  
        <Dialog
          open={openConfirm}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the department "{department.departmentName}" ({department.departmentCode})? 
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary" disabled={isDeleting}>Cancel</Button>
            <Button 
              onClick={handleConfirmDelete} 
              color="error" 
              disabled={isDeleting}
              autoFocus
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
  
        <Dialog
          open={openEdit}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Department</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
                {error}
              </Alert>
            )}
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                name="departmentCode"
                label="Department Code"
                fullWidth
                variant="outlined"
                value={editData.departmentCode}
                onChange={handleInputChange}
                error={!!validationErrors.departmentCode}
                helperText={validationErrors.departmentCode}
                disabled={isUpdating}
                inputProps={{ maxLength: 10 }}
              />
              <TextField
                margin="dense"
                name="departmentName"
                label="Department Name"
                fullWidth
                variant="outlined"
                value={editData.departmentName}
                onChange={handleInputChange}
                error={!!validationErrors.departmentName}
                helperText={validationErrors.departmentName}
                disabled={isUpdating}
                inputProps={{ maxLength: 100 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit" disabled={isUpdating}>Cancel</Button>
            <Button 
              onClick={handleSubmitEdit} 
              color="primary" 
              disabled={isUpdating}
              variant="contained"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
  
        <Snackbar open={showSuccessAlert} autoHideDuration={4000} onClose={handleAlertClose}>
          <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </>
    );
  };
  
  export default DepartmentCard;