import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  CardActions, 
  Button, 
  Box,
  Avatar,
  Chip,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  IconButton,
  CircularProgress
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import CakeIcon from '@mui/icons-material/Cake';
import BadgeIcon from '@mui/icons-material/Badge';
import PaymentsIcon from '@mui/icons-material/Payments';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getDepartments } from '../../api/departmentsApi';

const EmployeeCard = ({ 
  employee, 
  onDelete, 
  onEdit, 
  onError 
}) => {
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsData = await getDepartments();
        setDepartments(departmentsData);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError("Failed to load department information");
        if (onError) {
          onError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [onError]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
    }).format(salary);
  };
  
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  const getDepartmentInfo = () => {
    if (loading) {
      return { name: "Loading...", code: "..." };
    }
    
    const department = departments.find(dept => dept.id === employee.departmentId);
    
    if (department) {
      return {
        name: department.departmentName,
        code: department.departmentCode
      };
    } else {
      return {
        name: "Unknown Department",
        code: "N/A"
      };
    }
  };
  
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const age = calculateAge(employee.dateOfBirth);
  const departmentInfo = getDepartmentInfo();
  
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(employee.employeeId);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError(err.message || "Failed to delete employee. Please try again.");
      if (onError) {
        onError(err);
      }
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(employee);
    }
  };
  
  const handleErrorClose = () => {
    setError(null);
  };
  
  return (
    <>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[6],
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              src={employee.avatar} 
              alt={fullName}
              sx={{ 
                width: 56, 
                height: 56, 
                mr: 2,
                backgroundColor: theme.palette.primary.main
              }}
            >
              {employee.firstName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h2">{fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {`Age: ${age}`}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2, mb: 1 }}>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                <Typography variant="body2">Loading department info...</Typography>
              </Box>
            ) : (
              <Chip 
                icon={<WorkIcon fontSize="small" />}
                label={`Department : ${departmentInfo.name} (${departmentInfo.code})`} 
                size="small" 
                sx={{ 
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.dark,
                }} 
              />
            )}
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <Typography variant="body2" color="text.secondary">
                {employee.emailAddress}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CakeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <Typography variant="body2" color="text.secondary">
                {formatDate(employee.dateOfBirth)}
              </Typography>
            </Box>
            {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BadgeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <Typography variant="body2" color="text.secondary">
                ID: {employee.employeeId.substring(0, 8)}...
              </Typography>
            </Box> */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PaymentsIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <Typography variant="body2" color="text.secondary">
                Salary: {formatSalary(employee.salary)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Box>
            <Button 
              size="small" 
              color="primary" 
              startIcon={<EditIcon />} 
              onClick={handleEdit}
            >
              Edit
            </Button>
          </Box>
          <Box>
            <Button 
              size="small" 
              color="error" 
              startIcon={<DeleteIcon />} 
              onClick={handleOpenDeleteDialog}
            >
              Delete
            </Button>
          </Box>
        </CardActions>
      </Card>
      
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Employee
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete {fullName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            autoFocus
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EmployeeCard;