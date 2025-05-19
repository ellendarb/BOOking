import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField
} from '@mui/material';

const DebugAuth = () => {
  const { isAuthenticated, isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();
  const [localStorageItems, setLocalStorageItems] = useState({});

  // Обновление информации о localStorage
  const updateLocalStorageInfo = () => {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      items[key] = localStorage.getItem(key);
    }
    setLocalStorageItems(items);
  };

  // Проверка localStorage при загрузке компонента
  useEffect(() => {
    updateLocalStorageInfo();
  }, []);

  // Принудительный вход с правами админа
  const handleForceAdminLogin = async () => {
    try {
      await login('admin', 'admin');
      console.log('Выполнен вход с правами администратора');

      // Убедимся, что данные сохранены в localStorage
      localStorage.setItem('token', 'debug-admin-token');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userId', 'admin');

      // Обновим информацию
      updateLocalStorageInfo();

      // Перезагрузим страницу, чтобы обновить состояние
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при входе:', error);
    }
  };

  // Принудительный выход
  const handleForceLogout = () => {
    logout();
    localStorage.clear();
    updateLocalStorageInfo();
    window.location.reload();
  };

  // Перейти на админ-панель
  const goToAdmin = () => {
    navigate('/admin');
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Отладка аутентификации
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6">Текущее состояние:</Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Аутентифицирован"
              secondary={isAuthenticated ? 'Да' : 'Нет'}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Права администратора"
              secondary={isAdmin ? 'Да' : 'Нет'}
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Действия:</Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleForceAdminLogin}
          >
            Войти как администратор
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleForceLogout}
          >
            Выйти
          </Button>
          <Button
            variant="outlined"
            onClick={goToAdmin}
          >
            Перейти в админ-панель
          </Button>
          <Button
            variant="outlined"
            onClick={updateLocalStorageInfo}
          >
            Обновить информацию
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Содержимое localStorage:</Typography>
        <TextField
          multiline
          fullWidth
          rows={8}
          variant="outlined"
          value={JSON.stringify(localStorageItems, null, 2)}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mt: 2 }}
        />
      </Paper>
    </Container>
  );
};

export default DebugAuth;