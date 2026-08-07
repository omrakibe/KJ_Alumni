package com.kjalumni.auth.repository;

import com.kjalumni.auth.entity.PendingRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PendingRegistrationRepository extends JpaRepository<PendingRegistration, UUID>
{

    Optional<PendingRegistration> findByEmail(String email);

    Optional<PendingRegistration> findByVerificationToken(String verificationToken);

    boolean existsByEmail(String email);

    boolean existsByContactNumber(String contactNumber);

    void deleteByEmail(String email);

}