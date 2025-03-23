import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { useApi } from '../../hooks/useApi';
import { getDepartments } from '../../api/departmentsApi';
import { addEmployee, updateEmployee } from '../../api/employeesApi';

const EmployeeForm = ({ employee, onClose, onSuccess }) => {
  const { data: departments, loading: loadingDepartments } = useApi(getDepartments);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    dateOfBirth: '',
    salary: '',
    departmentId: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (employee) {
      const dob = employee.dateOfBirth ? 
        new Date(employee.dateOfBirth).toISOString().split('T')[0] : 
        '';
      
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        emailAddress: employee.emailAddress || '',
        dateOfBirth: dob,
        salary: employee.salary || '',
        departmentId: employee.departmentId || ''
      });
    }
  }, [employee]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;

  if (!formData.firstName.trim()) {
    newErrors.firstName = 'First name is required';
  } else if (!nameRegex.test(formData.firstName)) {
    newErrors.firstName = 'First name can only contain letters';
  }
    
    if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      } else if (!nameRegex.test(formData.lastName)) {
        newErrors.lastName = 'Last name can only contain letters';
      }
    
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Email is invalid';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.salary) {
        newErrors.salary = 'Salary is required';
      } else if (!/^\d+(\.\d{1,2})?$/.test(formData.salary)) {
        newErrors.salary = 'Salary must be a valid number';
      } else if (Number(formData.salary) <= 0) {
        newErrors.salary = 'Salary must be greater than zero';
      }
    
    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const date = new Date(formData.dateOfBirth);
      
      const apiData = {
        ...formData,
        salary: Number(formData.salary),
        dateOfBirth: new Date(formData.dateOfBirth).toISOString()
      };
      
      if (employee?.employeeId) {
        await updateEmployee(employee.employeeId, apiData);
      } else {
        await addEmployee(apiData);
      }
      
      onSuccess();
      
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save employee. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={Boolean(errors.firstName)}
          helperText={errors.firstName}
          disabled={isSubmitting}
        />
        
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={Boolean(errors.lastName)}
          helperText={errors.lastName}
          disabled={isSubmitting}
        />
        
        <TextField
          fullWidth
          label="Email Address"
          name="emailAddress"
          type="email"
          value={formData.emailAddress}
          onChange={handleChange}
          error={Boolean(errors.emailAddress)}
          helperText={errors.emailAddress}
          disabled={isSubmitting}
        />
        
        <TextField
          fullWidth
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          error={Boolean(errors.dateOfBirth)}
          helperText={errors.dateOfBirth || "YYYY-MM-DD"}
          InputLabelProps={{ shrink: true }}
          disabled={isSubmitting}
        />
        
        <TextField
          fullWidth
          label="Salary"
          name="salary"
          type="number"
          value={formData.salary}
          onChange={handleChange}
          error={Boolean(errors.salary)}
          helperText={errors.salary}
          InputProps={{ inputProps: { min: 0 } }}
          disabled={isSubmitting}
        />
        
        <FormControl 
          fullWidth 
          error={Boolean(errors.departmentId)}
          disabled={isSubmitting || loadingDepartments}
        >
          <InputLabel>Department</InputLabel>
          <Select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            label="Department"
          >
            {loadingDepartments ? (
              <MenuItem disabled>Loading departments...</MenuItem>
            ) : (
              departments?.map(dept => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.departmentName} ({dept.departmentCode})
                </MenuItem>
              ))
            )}
          </Select>
          {errors.departmentId && (
            <FormHelperText>{errors.departmentId}</FormHelperText>
          )}
        </FormControl>
        
        {errors.submit && (
          <Box sx={{ color: 'error.main', mt: 1 }}>
            {errors.submit}
          </Box>
        )}
      </Box>
      
      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Saving...' : (employee ? 'Update' : 'Add')}
        </Button>
      </DialogActions>
    </form>
  );
};

export default EmployeeForm;