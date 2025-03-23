import { Routes, Route } from 'react-router-dom';
import DepartmentsPage from './pages/DepartmentsPage';
import EmployeesPage from './pages/EmployeesPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/departments" element={<DepartmentsPage />} />
      <Route path="/employees" element={<EmployeesPage />} />
    </Routes>
  );
};

export default AppRoutes;
