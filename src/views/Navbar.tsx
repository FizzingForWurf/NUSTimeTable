import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  alpha,
} from '@mui/material';
import { AccountCircle, Search } from '@mui/icons-material';
import SearchBar, { SearchIconWrapper, StyledInputBase } from './SearchBar';

const Navbar = () => {
  const navigate = useNavigate();
  const curUser = useSelector((state: RootState) => state.user.user);

  return (
    <AppBar position="static">
      <Toolbar>
        <SearchBar>
          <SearchIconWrapper>
            <Search />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </SearchBar>
        <Typography
          variant="h6"
          component="div"
          noWrap
          sx={{
            px: 1,
            fontWeight: 700,
            borderRadius: 2,
            display: { xs: 'none', sm: 'block' },
            '&:hover': {
              backgroundColor: alpha('#FFFFFF', 0.1),
            },
          }}
          onClick={() => navigate('/')}
        >
          NUS TimeTable
        </Typography>

        <Box sx={{ flexGrow: 1 }} />
        {!curUser && (
          <Button color="inherit" onClick={() => navigate('login')}>
            Login
          </Button>
        )}
        {curUser && (
          <div>
            <IconButton
              size="large"
              aria-label="Current user account"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => {
                navigate('/profile');
              }}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
