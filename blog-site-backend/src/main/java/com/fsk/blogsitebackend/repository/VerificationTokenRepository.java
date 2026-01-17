package com.fsk.blogsitebackend.repository;

import com.fsk.blogsitebackend.entities.VerificationToken;
import com.fsk.blogsitebackend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, UUID> {
    Optional<VerificationToken> findByToken(String token);

    Optional<VerificationToken> findByUser(User user);

    void deleteByUser(User user);
}
