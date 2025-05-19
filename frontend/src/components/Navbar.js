import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Booking Service
        </Typography>
        <Box>
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/bookings"
              >
                Мои бронирования
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/create-booking"
              >
                Создать бронирование
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
              >
                Войти
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
              >
                Регистрация
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;