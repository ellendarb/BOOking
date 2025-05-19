import React, { useState, useEffect } from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Alert,
  Chip,
  Snackbar,
  Tooltip
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    workspaceId: '',
    userId: '',
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // +1 час
    status: 'PENDING',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchBookings();
    fetchWorkspaces();
  }, []);

  const fetchBookings = async () => {
    try {
      // Предполагаем, что есть API для получения всех бронирований
      const response = await axios.get('/api/bookings/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookings(response.data);
    } catch (err) {
      setError('Ошибка при загрузке бронирований');
      console.error('Error fetching bookings:', err);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const response = await axios.get('/api/workspaces', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWorkspaces(response.data);
    } catch (err) {
      console.error('Error fetching workspaces:', err);
    }
  };

  const handleOpenDialog = (booking = null) => {
    if (booking) {
      setSelectedBooking(booking);
      setFormData({
        workspaceId: booking.workspace.id,
        userId: booking.userId,
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime),
        status: booking.status,
        notes: booking.notes || ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
    });
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(
        `/api/bookings/${bookingId}/status`,
        null,
        {
          params: { status: newStatus },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccess(`Статус бронирования изменен на ${newStatus}`);
      fetchBookings();
    } catch (err) {
      setError('Ошибка при обновлении статуса бронирования');
      console.error('Error updating booking status:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedBooking) {
        // Обновляем бронирование
        await axios.put(
          `/api/bookings/${selectedBooking.id}/reschedule`,
          null,
          {
            params: {
              newStartTime: formData.startTime.toISOString(),
              newEndTime: formData.endTime.toISOString()
            },
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Обновляем статус, если он изменился
        if (formData.status !== selectedBooking.status) {
          await axios.put(
            `/api/bookings/${selectedBooking.id}/status`,
            null,
            {
              params: { status: formData.status },
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        }

        setSuccess('Бронирование успешно обновлено');
      }
      fetchBookings();
      handleCloseDialog();
    } catch (err) {
      setError('Ошибка при сохранении бронирования');
      console.error('Error saving booking:', err);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'PENDING':
        return <Chip size="small" label="Ожидает подтверждения" color="warning" />;
      case 'CONFIRMED':
        return <Chip size="small" label="Подтверждено" color="success" />;
      case 'CANCELLED':
        return <Chip size="small" label="Отменено" color="error" />;
      case 'COMPLETED':
        return <Chip size="small" label="Завершено" color="default" />;
      default:
        return <Chip size="small" label={status} />;
    }
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <h2>Управление бронированиями</h2>
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
              <TableCell>Пользователь</TableCell>
              <TableCell>Рабочее место</TableCell>
              <TableCell>Начало</TableCell>
              <TableCell>Конец</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.userId}</TableCell>
                <TableCell>{booking.workspace.name}</TableCell>
                <TableCell>{format(new Date(booking.startTime), 'PPp', { locale: ru })}</TableCell>
                <TableCell>{format(new Date(booking.endTime), 'PPp', { locale: ru })}</TableCell>
                <TableCell>{getStatusChip(booking.status)}</TableCell>
                <TableCell>
                  <Tooltip title="Редактировать">
                    <IconButton color="primary" onClick={() => handleOpenDialog(booking)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  {booking.status === 'PENDING' && (
                    <Tooltip title="Подтвердить">
                      <IconButton
                        color="success"
                        onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                    <Tooltip title="Отменить">
                      <IconButton
                        color="error"
                        onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог редактирования бронирования */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Редактировать бронирование</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Рабочее место</InputLabel>
            <Select
              name="workspaceId"
              value={formData.workspaceId}
              onChange={handleInputChange}
              disabled
            >
              {workspaces.map((workspace) => (
                <MenuItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            name="userId"
            label="ID пользователя"
            fullWidth
            value={formData.userId}
            onChange={handleInputChange}
            disabled
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
            <Box sx={{ mt: 2, mb: 2 }}>
              <DateTimePicker
                label="Время начала"
                value={formData.startTime}
                onChange={(date) => handleDateChange('startTime', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <DateTimePicker
                label="Время окончания"
                value={formData.endTime}
                onChange={(date) => handleDateChange('endTime', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
          </LocalizationProvider>

          <FormControl fullWidth margin="dense">
            <InputLabel>Статус</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <MenuItem value="PENDING">Ожидает подтверждения</MenuItem>
              <MenuItem value="CONFIRMED">Подтверждено</MenuItem>
              <MenuItem value="CANCELLED">Отменено</MenuItem>
              <MenuItem value="COMPLETED">Завершено</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            name="notes"
            label="Примечания"
            fullWidth
            multiline
            rows={3}
            value={formData.notes}
            onChange={handleInputChange}
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

export default AdminBookings;