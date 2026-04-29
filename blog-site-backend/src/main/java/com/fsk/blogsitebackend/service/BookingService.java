package com.fsk.blogsitebackend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fsk.blogsitebackend.common.exception.ResourceNotFoundException;
import com.fsk.blogsitebackend.dto.booking.BookingResponse;
import com.fsk.blogsitebackend.dto.booking.bookingrequest.CreateBookingRequest;
import com.fsk.blogsitebackend.entities.AvailabilitySlot;
import com.fsk.blogsitebackend.entities.Booking;
import com.fsk.blogsitebackend.entities.Booking.BookingStatus;
import com.fsk.blogsitebackend.entities.Notification.NotificationType;
import com.fsk.blogsitebackend.entities.User;
import com.fsk.blogsitebackend.repository.AvailabilitySlotRepository;
import com.fsk.blogsitebackend.repository.BookingRepository;
import com.fsk.blogsitebackend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public BookingResponse createBooking(CreateBookingRequest request) {
        AvailabilitySlot slot = availabilitySlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("AvailabilitySlot", "id", request.getSlotId()));

        if (slot.getStartAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Past slots cannot be booked");
        }
        if (!Boolean.TRUE.equals(slot.getIsActive())) {
            throw new IllegalArgumentException("Selected slot is not active");
        }
        if (Boolean.TRUE.equals(slot.getIsBooked())) {
            throw new IllegalArgumentException("Selected slot is already booked");
        }

        Booking booking = new Booking();
        booking.setAvailabilitySlot(slot);
        booking.setClientName(request.getName());
        booking.setClientEmail(request.getEmail());
        booking.setTitle(request.getTitle());
        booking.setDescription(request.getDescription());
        booking.setAmount(slot.getPrice());
        booking.setCurrency(slot.getCurrency());
        booking.setStatus(BookingStatus.PENDING_PAYMENT);

        slot.setIsBooked(true);
        availabilitySlotRepository.save(slot);

        Booking savedBooking = bookingRepository.save(booking);

        emailService.sendBookingNotification(savedBooking);
        notifyAdmin(savedBooking);

        return toResponse(savedBooking);
    }

    public BookingResponse markAsPaid(UUID bookingId, String paymentReference) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (booking.getStatus() == BookingStatus.PAID) {
            return toResponse(booking);
        }

        booking.setStatus(BookingStatus.PAID);
        booking.setPaymentReference(paymentReference);

        Booking updatedBooking = bookingRepository.save(booking);

        emailService.sendBookingPaidEmailToClient(updatedBooking);
        return toResponse(updatedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .slotId(booking.getAvailabilitySlot().getId())
                .startAt(booking.getAvailabilitySlot().getStartAt())
                .endAt(booking.getAvailabilitySlot().getEndAt())
                .clientName(booking.getClientName())
                .clientEmail(booking.getClientEmail())
                .title(booking.getTitle())
                .description(booking.getDescription())
                .status(booking.getStatus())
                .amount(booking.getAmount())
                .currency(booking.getCurrency())
                .paymentReference(booking.getPaymentReference())
                .createdAt(booking.getCreatedAt())
                .build();
    }

    private void notifyAdmin(Booking booking) {
        List<User> admins = userRepository.findAll().stream()
                .filter(user -> user.getRole() == User.UserRole.ADMIN)
                .toList();

        if (admins.isEmpty()) {
            return;
        }

        String message = String.format("Yeni rezervasyon: %s - %s", booking.getTitle(), booking.getClientName());
        notificationService.createNotification(admins.get(0), NotificationType.BOOKING_REQUEST, message, null, null);
    }
}
