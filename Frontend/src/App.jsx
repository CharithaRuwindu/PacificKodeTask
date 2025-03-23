import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from './components/common/Sidebar';
import DepartmentsPage from './pages/DepartmentsPage';
import EmployeesPage from './pages/EmployeesPage';
import { AppProvider, useAppContext } from './context/AppContext';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

const MainContent = () => {
  const { activePage } = useAppContext();
  
  return (
    <Box component="main" sx={{ display: 'flex', flexGrow: 1, height: '100vh' }}>
      {activePage === 'departments' ? <DepartmentsPage /> : <EmployeesPage />}
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Sidebar />
          <MainContent />
        </Box>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;