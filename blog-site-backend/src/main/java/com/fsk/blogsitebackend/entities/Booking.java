package com.fsk.blogsitebackend.entities;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "bookings")
@Getter
@Setter
public class Booking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "availability_slot_id", nullable = false, unique = true)
    private AvailabilitySlot availabilitySlot;

    @Column(name = "client_name", nullable = false, length = 120)
    private String clientName;

    @Column(name = "client_email", nullable = false, length = 180)
    private String clientEmail;

    @Column(name = "title", nullable = false, length = 120)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private BookingStatus status = BookingStatus.PENDING_PAYMENT;

    @Column(name = "payment_reference", length = 255)
    private String paymentReference;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "TRY";

    public enum BookingStatus {
        PENDING_PAYMENT,
        PAID,
        CANCELLED
    }
}
