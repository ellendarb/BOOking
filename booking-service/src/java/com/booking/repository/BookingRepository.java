package com.booking.repository;

import com.booking.model.Booking;
import com.booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByWorkspaceIdAndStartTimeBetweenAndStatusNot(
            Long workspaceId,
            LocalDateTime startTime,
            LocalDateTime endTime,
            BookingStatus status
    );

    List<Booking> findByUserId(String userId);
}