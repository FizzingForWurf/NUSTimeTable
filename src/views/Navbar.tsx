import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
  alpha,
} from '@mui/material';
import { AccountCircle, Search, Close } from '@mui/icons-material';
import SearchBar, { SearchIconWrapper, StyledInputBase } from './SearchBar';
import { ReactNode } from 'react';

const Navbar = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const curUser = useSelector((state: RootState) => state.user.user);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        overflow: 'hidden', // Remove horizontal scroll bar
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          minHeight: 64,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Toolbar>
          <SearchBar>
            <SearchIconWrapper>
              <Search />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton>
              <Close sx={{ color: 'white', opacity: 0.5 }} />
            </IconButton>
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

          <Button color="inherit" onClick={() => navigate('modules')}>
            Module List
          </Button>

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
      <Toolbar />
      {children}
    </Box>
  );
};

export default Navbar;
