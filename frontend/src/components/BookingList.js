import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/bookings/user/1', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data);
    } catch (error) {
      setError('Ошибка при загрузке бронирований');
      console.error('Error fetching bookings:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/bookings/${bookingId}/status`,
        null,
        {
          params: { status: 'CANCELLED' },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBookings();
    } catch (error) {
      setError('Ошибка при отмене бронирования');
      console.error('Error cancelling booking:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Мои бронирования
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
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
                  <TableCell>{booking.workspace.name}</TableCell>
                  <TableCell>
                    {format(new Date(booking.startTime), 'PPp', { locale: ru })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.endTime), 'PPp', { locale: ru })}
                  </TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>
                    {booking.status === 'CONFIRMED' && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Отменить
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default BookingList;