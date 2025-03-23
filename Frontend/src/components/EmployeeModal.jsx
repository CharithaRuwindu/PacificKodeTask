import { useState } from "react";
import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";

export default function EmployeeModal({ open, onClose }) {
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    age: "",
    salary: "",
    department: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newEmployee = { ...employee, [name]: value };
    
    if (name === "dob") {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      newEmployee.age = age;
    }
    setEmployee(newEmployee);
  };

  const handleSubmit = () => {
    let newErrors = {
      firstName: !employee.firstName.trim(),
      lastName: !employee.lastName.trim(),
      email: !employee.email.trim(),
      dob: !employee.dob.trim(),
      salary: !employee.salary.trim(),
      department: !employee.department.trim(),
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).includes(true)) {
      console.log("Employee Data Submitted:", employee);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white shadow-lg rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Employee</h2>
        <TextField label="First Name" name="firstName" fullWidth margin="normal" value={employee.firstName} onChange={handleChange} error={errors.firstName} helperText={errors.firstName ? "First name is required" : ""} />
        <TextField label="Last Name" name="lastName" fullWidth margin="normal" value={employee.lastName} onChange={handleChange} error={errors.lastName} helperText={errors.lastName ? "Last name is required" : ""} />
        <TextField label="Email" name="email" fullWidth margin="normal" value={employee.email} onChange={handleChange} error={errors.email} helperText={errors.email ? "Email is required" : ""} />
        <TextField label="Date of Birth" name="dob" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={employee.dob} onChange={handleChange} error={errors.dob} helperText={errors.dob ? "Date of birth is required" : ""} />
        <TextField label="Age" name="age" fullWidth margin="normal" value={employee.age} disabled />
        <TextField label="Salary" name="salary" fullWidth margin="normal" value={employee.salary} onChange={handleChange} error={errors.salary} helperText={errors.salary ? "Salary is required" : ""} />
        <TextField select label="Department" name="department" fullWidth margin="normal" value={employee.department} onChange={handleChange} error={errors.department} helperText={errors.department ? "Department is required" : ""}>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="IT">IT</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
        </TextField>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onClose} color="secondary" variant="contained">Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">Save</Button>
        </div>
      </Box>
    </Modal>
  );
}
