import { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box,
  Typography,
  useTheme,
  styled
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import { useAppContext } from '../../context/AppContext';

const drawerWidth = 240;

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  height: 64,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: active ? theme.palette.action.selected : theme.palette.action.hover,
  },
}));

const Sidebar = () => {
  const theme = useTheme();
  const { activePage, setActivePage } = useAppContext();
  
  const handleNavigation = (page) => {
    setActivePage(page);
  };
  
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <LogoBox>
        <Typography variant="h6" fontWeight="bold">Company Portal</Typography>
      </LogoBox>
      <Divider />
      <List sx={{ py: 2 }}>
        <StyledListItem
          button
          active={activePage === 'departments' ? 1 : 0}
          onClick={() => handleNavigation('departments')}
          sx={{ cursor: 'pointer' }}
        >
          <ListItemIcon>
            <BusinessIcon color={activePage === 'departments' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="Departments" 
            primaryTypographyProps={{ 
              fontWeight: activePage === 'departments' ? 'bold' : 'regular' 
            }}
          />
        </StyledListItem>
        <StyledListItem
          button
          active={activePage === 'employees' ? 1 : 0}
          onClick={() => handleNavigation('employees')}
          sx={{ cursor: 'pointer' }}
        >
          <ListItemIcon>
            <PeopleIcon color={activePage === 'employees' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="Employees" 
            primaryTypographyProps={{ 
              fontWeight: activePage === 'employees' ? 'bold' : 'regular' 
            }}
          />
        </StyledListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;