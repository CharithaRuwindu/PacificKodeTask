import axios from './axios';

export const getDepartments = async () => {
  try {
    const response = await axios.get('/api/Department');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const getDepartment = async (id) => {
  try {
    const response = await axios.get(`/api/Department/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching department ${id}:`, error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
    try {
      const response = await axios.delete(`/api/Department/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting department ${id}:`, error);
      throw error;
    }
  };
  
  export const createDepartment = async (departmentData) => {
    try {
      const response = await axios.post('/api/Department', departmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  };
  
  export const updateDepartment = async (id, departmentData) => {
    try {
      const response = await axios.put(`/api/Department/${id}`, departmentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating department ${id}:`, error);
      throw error;
    }
  };

