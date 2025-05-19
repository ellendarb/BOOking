import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Tabs,
  Tab,
  Typography,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import AdminWorkspaces from './admin/AdminWorkspaces';
import AdminBookings from './admin/AdminBookings';
import AdminUsers from './admin/AdminUsers';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function AdminPanel() {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, isAdmin } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  // Отладка состояния аутентификации
  useEffect(() => {
    console.log('AdminPanel - состояние аутентификации:', { isAuthenticated, isAdmin });
    setAuthChecked(true);
  }, [isAuthenticated, isAdmin]);

  // После проверки состояния аутентификации
  if (authChecked && !isAuthenticated) {
    console.log('Перенаправление на /login из-за отсутствия аутентификации');
    return <Navigate to="/login?redirect=/admin" />;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Панель администратора
        </Typography>

        {!isAdmin && isAuthenticated && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            У вас нет прав администратора для доступа к этой странице.
          </Alert>
        )}

        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile}
            centered={!isMobile}
          >
            <Tab label="Рабочие места" />
            <Tab label="Бронирования" />
            <Tab label="Пользователи" />
          </Tabs>
        </Paper>

        <Box sx={{ p: 1 }}>
          {tabValue === 0 && <AdminWorkspaces />}
          {tabValue === 1 && <AdminBookings />}
          {tabValue === 2 && <AdminUsers />}
        </Box>
      </Box>
    </Container>
  );
}

export default AdminPanel;