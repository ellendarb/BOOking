package com.booking.controller;

import com.booking.model.Booking;
import com.booking.model.BookingStatus;
import com.booking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking Controller", description = "API для управления бронированиями")
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Создать новое бронирование")
    public ResponseEntity<Booking> createBooking(
            @RequestParam Long workspaceId,
            @RequestParam String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(bookingService.createBooking(workspaceId, userId, startTime, endTime, notes));
    }

    @PutMapping("/{bookingId}/status")
    @Operation(summary = "Обновить статус бронирования")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(bookingId, status));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Получить все бронирования пользователя")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }
}