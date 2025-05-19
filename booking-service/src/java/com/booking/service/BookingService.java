package com.booking.service;

import com.booking.model.Booking;
import com.booking.model.BookingStatus;
import com.booking.model.Workspace;
import com.booking.repository.BookingRepository;
import com.booking.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final WorkspaceRepository workspaceRepository;

    @Transactional
    public Booking createBooking(Long workspaceId, String userId, LocalDateTime startTime,
                                 LocalDateTime endTime, String notes) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        // Проверяем доступность рабочего места
        List<Booking> conflictingBookings = bookingRepository
                .findByWorkspaceIdAndStartTimeBetweenAndStatusNot(
                        workspaceId, startTime, endTime, BookingStatus.CANCELLED);

        if (!conflictingBookings.isEmpty()) {
            throw new RuntimeException("Workspace is already booked for this time period");
        }

        Booking booking = new Booking();
        booking.setWorkspace(workspace);
        booking.setUserId(userId);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setStatus(BookingStatus.PENDING);
        booking.setNotes(notes);

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }
}