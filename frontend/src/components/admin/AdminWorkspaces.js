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
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

function AdminWorkspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    isAvailable: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await axios.get('/api/workspaces', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWorkspaces(response.data);
    } catch (err) {
      setError('Ошибка при загрузке рабочих мест');
      console.error('Error fetching workspaces:', err);
    }
  };

  const handleOpenDialog = (workspace = null) => {
    if (workspace) {
      setSelectedWorkspace(workspace);
      setFormData({
        name: workspace.name,
        description: workspace.description,
        location: workspace.location,
        isAvailable: workspace.isAvailable
      });
    } else {
      setSelectedWorkspace(null);
      setFormData({
        name: '',
        description: '',
        location: '',
        isAvailable: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWorkspace(null);
  };

  const handleOpenConfirmDelete = (workspace) => {
    setSelectedWorkspace(workspace);
    setConfirmDeleteDialog(true);
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteDialog(false);
    setSelectedWorkspace(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isAvailable' ? checked : value
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedWorkspace) {
        // Обновление существующего рабочего места
        await axios.put(
          `/api/workspaces/${selectedWorkspace.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSuccess('Рабочее место успешно обновлено');
      } else {
        // Создание нового рабочего места
        await axios.post(
          '/api/workspaces',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSuccess('Рабочее место успешно создано');
      }
      fetchWorkspaces();
      handleCloseDialog();
    } catch (err) {
      setError('Ошибка при сохранении рабочего места');
      console.error('Error saving workspace:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/workspaces/${selectedWorkspace.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess('Рабочее место успешно удалено');
      fetchWorkspaces();
      handleCloseConfirmDelete();
    } catch (err) {
      setError('Ошибка при удалении рабочего места');
      console.error('Error deleting workspace:', err);
    }
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <h2>Управление рабочими местами</h2>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Добавить рабочее место
          </Button>
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
              <TableCell>Название</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Локация</TableCell>
              <TableCell>Доступность</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workspaces.map((workspace) => (
              <TableRow key={workspace.id}>
                <TableCell>{workspace.id}</TableCell>
                <TableCell>{workspace.name}</TableCell>
                <TableCell>{workspace.description}</TableCell>
                <TableCell>{workspace.location}</TableCell>
                <TableCell>{workspace.isAvailable ? 'Доступно' : 'Недоступно'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(workspace)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenConfirmDelete(workspace)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог создания/редактирования рабочего места */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedWorkspace ? 'Редактировать рабочее место' : 'Добавить рабочее место'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Название"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Описание"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Локация"
            fullWidth
            value={formData.location}
            onChange={handleInputChange}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isAvailable}
                onChange={handleInputChange}
                name="isAvailable"
              />
            }
            label="Доступно для бронирования"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={confirmDeleteDialog} onClose={handleCloseConfirmDelete}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите удалить рабочее место "{selectedWorkspace?.name}"?
          Это действие нельзя будет отменить.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete}>Отмена</Button>
          <Button onClick={handleDelete} color="error">
            Удалить
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

export default AdminWorkspaces;