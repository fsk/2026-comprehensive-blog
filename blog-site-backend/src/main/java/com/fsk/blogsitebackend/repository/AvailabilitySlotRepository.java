package com.fsk.blogsitebackend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fsk.blogsitebackend.entities.AvailabilitySlot;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, UUID> {

    boolean existsByStartAtAndEndAt(LocalDateTime startAt, LocalDateTime endAt);

    List<AvailabilitySlot> findByStartAtBetweenAndIsActiveTrueAndIsBookedFalseOrderByStartAtAsc(
            LocalDateTime from,
            LocalDateTime to);
}
