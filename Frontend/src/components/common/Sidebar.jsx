import { useLocation, useNavigate } from 'react-router-dom';
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
  cursor: 'pointer',
}));

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

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
          active={location.pathname === '/departments'}
          onClick={() => navigate('/departments')}
        >
          <ListItemIcon>
            <BusinessIcon color={location.pathname === '/departments' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="Departments" 
            primaryTypographyProps={{ 
              fontWeight: location.pathname === '/departments' ? 'bold' : 'regular' 
            }}
          />
        </StyledListItem>

        <StyledListItem
          active={location.pathname === '/employees'}
          onClick={() => navigate('/employees')}
        >
          <ListItemIcon>
            <PeopleIcon color={location.pathname === '/employees' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="Employees" 
            primaryTypographyProps={{ 
              fontWeight: location.pathname === '/employees' ? 'bold' : 'regular' 
            }}
          />
        </StyledListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
