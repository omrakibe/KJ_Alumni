package com.kjalumni.auth.entity;

import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pending_registrations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingRegistration extends BaseEntity
{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String firstName;

    private String middleName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String contactNumber;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Branch branch;

    @Column(nullable = false)
    private Integer passoutYear;

    private String company;

    private String jobRole;

    @Column(precision = 10, scale = 2)
    private BigDecimal currentPackage;

    @Column(precision = 4, scale = 1)
    private BigDecimal experience;

    @Column(nullable = false)
    @Builder.Default
    private boolean emailVerified = false;

    private LocalDateTime emailVerifiedAt;

    @Column(nullable = false, unique = true)
    private String verificationToken;

    @Column(nullable = false)
    private LocalDateTime tokenExpiry;
}