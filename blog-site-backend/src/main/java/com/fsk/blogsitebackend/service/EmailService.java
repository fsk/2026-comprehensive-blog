package com.fsk.blogsitebackend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.fsk.blogsitebackend.entities.Booking;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${booking.notification-to-email:${spring.mail.username}}")
    private String bookingNotificationEmail;

    @Async
    public void sendVerificationEmail(String toEmail, String fullName, String verificationUrl) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail, "Blog Site Support");
            helper.setTo(toEmail);
            helper.setSubject("Hesabınızı Doğrulayın - Blog Site");

            String content = buildVerificationEmailContent(fullName, verificationUrl);
            helper.setText(content, true);

            mailSender.send(message);
            log.info("Verification email sent to {}", toEmail);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send verification email to {}", toEmail, e);
            // In a real app, you might want to retry or store the failure status regarding
            // user notification
        }
    }

    private String buildVerificationEmailContent(String fullName, String verificationUrl) {
        return "<div style=\"font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;\">" +
                "<h2 style=\"color: #EA580C;\">Hoş Geldiniz, " + fullName + "!</h2>" +
                "<p>Kayıt işleminizi tamamlamak ve hesabınızı aktif etmek için lütfen aşağıdaki butona tıklayın:</p>" +
                "<div style=\"text-align: center; margin: 30px 0;\">" +
                "<a href=\"" + verificationUrl
                + "\" style=\"background: linear-gradient(to right, #EA580C, #FBBF24); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;\">Hesabımı Doğrula</a>"
                +
                "</div>" +
                "<p>Veya şu linki tarayıcınıza yapıştırın:</p>" +
                "<p><a href=\"" + verificationUrl + "\">" + verificationUrl + "</a></p>" +
                "<p>Sevgiler,<br>Furkan Sahin Kulaksiz</p>" +
                "</div>";
    }

    @Async
    public void sendBookingNotification(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail, "Blog Site Booking");
            helper.setTo(bookingNotificationEmail);
            helper.setSubject("Yeni Randevu Talebi: " + booking.getTitle());
            helper.setText(buildBookingOwnerContent(booking), true);

            mailSender.send(message);
            log.info("Booking notification email sent for booking {}", booking.getId());
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send booking notification email for booking {}", booking.getId(), e);
        }
    }

    @Async
    public void sendBookingPaidEmailToClient(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail, "Blog Site Booking");
            helper.setTo(booking.getClientEmail());
            helper.setSubject("Odeme Onayi: " + booking.getTitle());
            helper.setText(buildBookingClientPaidContent(booking), true);

            mailSender.send(message);
            log.info("Booking paid confirmation sent to {}", booking.getClientEmail());
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send booking paid confirmation for booking {}", booking.getId(), e);
        }
    }

    private String buildBookingOwnerContent(Booking booking) {
        return "<div style=\"font-family: Arial, sans-serif; padding: 20px;\">" +
                "<h2>Yeni Randevu Talebi</h2>" +
                "<p><strong>Baslik:</strong> " + booking.getTitle() + "</p>" +
                "<p><strong>Aciklama:</strong> " + booking.getDescription() + "</p>" +
                "<p><strong>Kisi:</strong> " + booking.getClientName() + " (" + booking.getClientEmail() + ")</p>" +
                "<p><strong>Tarih:</strong> " + booking.getAvailabilitySlot().getStartAt() + " - "
                + booking.getAvailabilitySlot().getEndAt() + "</p>" +
                "<p><strong>Fiyat:</strong> " + booking.getAmount() + " " + booking.getCurrency() + "</p>" +
                "<p><strong>Durum:</strong> " + booking.getStatus() + "</p>" +
                "</div>";
    }

    private String buildBookingClientPaidContent(Booking booking) {
        return "<div style=\"font-family: Arial, sans-serif; padding: 20px;\">" +
                "<h2>Odemeniz Basariyla Alindi</h2>" +
                "<p>Randevunuz onaylandi.</p>" +
                "<p><strong>Baslik:</strong> " + booking.getTitle() + "</p>" +
                "<p><strong>Tarih:</strong> " + booking.getAvailabilitySlot().getStartAt() + " - "
                + booking.getAvailabilitySlot().getEndAt() + "</p>" +
                "<p><strong>Tutar:</strong> " + booking.getAmount() + " " + booking.getCurrency() + "</p>" +
                "</div>";
    }
}
