package com.kjalumni.alumni.entity;

import com.kjalumni.auth.entity.User;
import com.kjalumni.common.entity.BaseEntity;
import com.kjalumni.common.enums.Branch;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "alumni")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alumni extends BaseEntity
{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String alumniId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String firstName;

    private String middleName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String contactNumber;

    @Column(nullable = false)
    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Branch branch;

    @Column(nullable = false)
    private Integer passoutYear;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String jobRole;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal currentPackage;

    @Column(nullable = false, precision = 4, scale = 1)
    private BigDecimal experience;
}