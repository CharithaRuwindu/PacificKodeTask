import { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

export default function DepartmentModal({ open, onClose }) {
  const [department, setDepartment] = useState({ code: "", name: "" });
  const [errors, setErrors] = useState({ code: false, name: false });

  const handleChange = (e) => {
    setDepartment({ ...department, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    let newErrors = {
      code: department.code.trim() === "",
      name: department.name.trim() === "",
    };
    setErrors(newErrors);

    if (!newErrors.code && !newErrors.name) {
      console.log("Department Data Submitted:", department);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white shadow-lg rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Department</h2>
        <TextField
          label="Department Code"
          name="code"
          fullWidth
          margin="normal"
          variant="outlined"
          value={department.code}
          onChange={handleChange}
          error={errors.code}
          helperText={errors.code ? "Department code is required" : ""}
        />
        <TextField
          label="Department Name"
          name="name"
          fullWidth
          margin="normal"
          variant="outlined"
          value={department.name}
          onChange={handleChange}
          error={errors.name}
          helperText={errors.name ? "Department name is required" : ""}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onClose} color="secondary" variant="contained">Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">Save</Button>
        </div>
      </Box>
    </Modal>
  );
}
