package com.fsk.blogsitebackend.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.common.exception.ResourceNotFoundException;
import com.fsk.blogsitebackend.dto.booking.AvailabilitySlotResponse;
import com.fsk.blogsitebackend.dto.booking.bookingrequest.GenerateAvailabilityRequest;
import com.fsk.blogsitebackend.dto.booking.bookingrequest.UpdateSlotPriceRequest;
import com.fsk.blogsitebackend.dto.booking.bookingrequest.UpdateSlotStatusRequest;
import com.fsk.blogsitebackend.entities.AvailabilitySlot;
import com.fsk.blogsitebackend.repository.AvailabilitySlotRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AvailabilityService {

    private static final Duration SLOT_INTERVAL = Duration.ofMinutes(30);
    private final AvailabilitySlotRepository availabilitySlotRepository;

    public int generateSlots(GenerateAvailabilityRequest request) {
        validateDateRange(request.getStartAt(), request.getEndAt());
        BigDecimal price = request.getPrice();
        String currency = request.getCurrency() == null || request.getCurrency().isBlank()
                ? "TRY"
                : request.getCurrency().trim().toUpperCase();

        List<AvailabilitySlot> slotsToSave = new ArrayList<>();
        LocalDateTime cursor = request.getStartAt();
        while (cursor.plus(SLOT_INTERVAL).compareTo(request.getEndAt()) <= 0) {
            LocalDateTime next = cursor.plus(SLOT_INTERVAL);
            if (!availabilitySlotRepository.existsByStartAtAndEndAt(cursor, next)) {
                AvailabilitySlot slot = new AvailabilitySlot();
                slot.setStartAt(cursor);
                slot.setEndAt(next);
                slot.setPrice(price);
                slot.setCurrency(currency);
                slot.setIsActive(true);
                slot.setIsBooked(false);
                slotsToSave.add(slot);
            }
            cursor = next;
        }

        availabilitySlotRepository.saveAll(slotsToSave);
        return slotsToSave.size();
    }

    @Transactional(readOnly = true)
    public List<AvailabilitySlotResponse> getPublicAvailability(LocalDateTime from, LocalDateTime to) {
        validateDateRange(from, to);
        return availabilitySlotRepository.findByStartAtBetweenAndIsActiveTrueAndIsBookedFalseOrderByStartAtAsc(from, to)
                .stream()
                .filter(slot -> slot.getStartAt().isAfter(LocalDateTime.now()))
                .map(this::toResponse)
                .toList();
    }

    public AvailabilitySlotResponse updatePrice(UUID slotId, UpdateSlotPriceRequest request) {
        AvailabilitySlot slot = availabilitySlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("AvailabilitySlot", "id", slotId));
        if (Boolean.TRUE.equals(slot.getIsBooked())) {
            throw new IllegalArgumentException("Booked slot price cannot be changed");
        }
        slot.setPrice(request.getPrice());
        slot.setCurrency(request.getCurrency() == null || request.getCurrency().isBlank()
                ? "TRY"
                : request.getCurrency().trim().toUpperCase());
        return toResponse(availabilitySlotRepository.save(slot));
    }

    public AvailabilitySlotResponse updateStatus(UUID slotId, UpdateSlotStatusRequest request) {
        AvailabilitySlot slot = availabilitySlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("AvailabilitySlot", "id", slotId));
        if (Boolean.TRUE.equals(slot.getIsBooked()) && !request.getIsActive()) {
            throw new IllegalArgumentException("Booked slot cannot be deactivated");
        }
        slot.setIsActive(request.getIsActive());
        return toResponse(availabilitySlotRepository.save(slot));
    }

    private AvailabilitySlotResponse toResponse(AvailabilitySlot slot) {
        return AvailabilitySlotResponse.builder()
                .id(slot.getId())
                .startAt(slot.getStartAt())
                .endAt(slot.getEndAt())
                .price(slot.getPrice())
                .currency(slot.getCurrency())
                .build();
    }

    private void validateDateRange(LocalDateTime startAt, LocalDateTime endAt) {
        if (startAt == null || endAt == null) {
            throw new IllegalArgumentException("Start and end time are required");
        }
        if (!startAt.isBefore(endAt)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
    }
}
