import axios from './axios';

export const getEmployees = async () => {
  try {
    const response = await axios.get('/api/Employee');
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const getEmployee = async (id) => {
  try {
    const response = await axios.get(`/api/Employee/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error);
    throw error;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const response = await axios.post('/api/Employee', employeeData);
    return response.data;
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
};

export const updateEmployee = async (id, updatedData) => {
  try {
    await axios.put(`/api/Employee/${id}`, updatedData);
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    await axios.delete(`/api/Employee/${id}`);
  } catch (error) {
    console.error(`Error deleting employee ${id}:`, error);
    throw error;
  }
};
