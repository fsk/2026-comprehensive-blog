package com.fsk.blogsitebackend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fsk.blogsitebackend.entities.Booking;
import com.fsk.blogsitebackend.entities.Booking.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    List<Booking> findAllByOrderByCreatedAtDesc();
}
