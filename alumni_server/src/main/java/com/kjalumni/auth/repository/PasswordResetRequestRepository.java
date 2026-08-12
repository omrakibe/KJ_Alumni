package com.kjalumni.auth.repository;

import com.kjalumni.auth.entity.PasswordResetRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetRequestRepository
        extends JpaRepository<PasswordResetRequest, UUID>
{

    Optional<PasswordResetRequest> findByUserId(UUID userId);

    void deleteByUserId(UUID userId);
}