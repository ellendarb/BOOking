import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControlLabel,
  Switch,
  Grid,
  Alert,
  Snackbar,
  Tooltip,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    isActive: true,
    isAdmin: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // В реальном приложении должен быть API для получения пользователей
      // Для демонстрации используем моковые данные
      // Раскомментируйте код ниже, когда будет реализован API

      /*
      const response = await axios.get('/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
      */

      // Моковые данные для демонстрации
      setUsers([
        { id: 1, username: 'admin', email: 'admin@example.com', isActive: true, isAdmin: true },
        { id: 2, username: 'user1', email: 'user1@example.com', isActive: true, isAdmin: false },
        { id: 3, username: 'user2', email: 'user2@example.com', isActive: false, isAdmin: false }
      ]);
    } catch (err) {
      setError('Ошибка при загрузке пользователей');
      console.error('Error fetching users:', err);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        isAdmin: user.isAdmin
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isActive' || name === 'isAdmin' ? checked : value
    });
  };

  const handleToggleStatus = async (userId, isCurrentlyActive) => {
    try {
      // В реальном приложении должен быть API для изменения статуса пользователя
      // Для демонстрации просто обновляем локальное состояние

      /*
      await axios.put(
        `/auth/users/${userId}/status`,
        { isActive: !isCurrentlyActive },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      */

      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, isActive: !isCurrentlyActive }
          : user
      ));

      setSuccess(`Статус пользователя ${isCurrentlyActive ? 'деактивирован' : 'активирован'}`);
    } catch (err) {
      setError('Ошибка при изменении статуса пользователя');
      console.error('Error toggling user status:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        // В реальном приложении должен быть API для обновления пользователя
        // Для демонстрации просто обновляем локальное состояние

        /*
        await axios.put(
          `/auth/users/${selectedUser.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        */

        setUsers(users.map(user =>
          user.id === selectedUser.id
            ? { ...user, ...formData }
            : user
        ));

        setSuccess('Пользователь успешно обновлен');
      }
      handleCloseDialog();
    } catch (err) {
      setError('Ошибка при сохранении пользователя');
      console.error('Error saving user:', err);
    }
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <h2>Управление пользователями</h2>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Имя пользователя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Администратор</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.isActive ? (
                    <Chip size="small" label="Активен" color="success" />
                  ) : (
                    <Chip size="small" label="Неактивен" color="error" />
                  )}
                </TableCell>
                <TableCell>
                  {user.isAdmin ? (
                    <Chip size="small" label="Да" color="primary" />
                  ) : (
                    <Chip size="small" label="Нет" />
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title="Редактировать">
                    <IconButton color="primary" onClick={() => handleOpenDialog(user)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={user.isActive ? "Деактивировать" : "Активировать"}>
                    <IconButton
                      color={user.isActive ? "error" : "success"}
                      onClick={() => handleToggleStatus(user.id, user.isActive)}
                    >
                      {user.isActive ? <LockIcon /> : <LockOpenIcon />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог редактирования пользователя */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Редактировать пользователя</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="username"
            label="Имя пользователя"
            fullWidth
            value={formData.username}
            onChange={handleInputChange}
            disabled
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleInputChange}
                name="isActive"
              />
            }
            label="Активен"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isAdmin}
                onChange={handleInputChange}
                name="isAdmin"
              />
            }
            label="Администратор"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminUsers;