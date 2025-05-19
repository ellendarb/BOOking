import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function CreateBooking() {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/workspaces', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkspaces(response.data);
    } catch (error) {
      setError('Ошибка при загрузке рабочих мест');
      console.error('Error fetching workspaces:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedWorkspace || !startTime || !endTime) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (startTime >= endTime) {
      setError('Время окончания должно быть позже времени начала');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8080/api/bookings',
        null,
        {
          params: {
            workspaceId: selectedWorkspace,
            userId: '1', // В реальном приложении это будет ID текущего пользователя
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            notes,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/bookings');
    } catch (error) {
      setError('Ошибка при создании бронирования');
      console.error('Error creating booking:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Создать бронирование
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Рабочее место</InputLabel>
              <Select
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
                required
              >
                {workspaces.map((workspace) => (
                  <MenuItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
              <DateTimePicker
                label="Время начала"
                value={startTime}
                onChange={setStartTime}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" required />
                )}
              />
              <DateTimePicker
                label="Время окончания"
                value={endTime}
                onChange={setEndTime}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" required />
                )}
              />
            </LocalizationProvider>

            <TextField
              fullWidth
              label="Примечания"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              margin="normal"
              multiline
              rows={4}
            />

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Создать бронирование
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default CreateBooking;