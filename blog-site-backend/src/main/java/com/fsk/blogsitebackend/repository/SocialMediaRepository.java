package com.fsk.blogsitebackend.repository;

import com.fsk.blogsitebackend.entities.SocialMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SocialMediaRepository extends JpaRepository<SocialMedia, UUID> {
    List<SocialMedia> findAllByIsActiveTrueOrderByDisplayOrderAsc();
}
