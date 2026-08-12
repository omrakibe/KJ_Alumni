package com.kjalumni.auth.dto;

import com.kjalumni.common.enums.Branch;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingRegistrationResponse
{

    private UUID id;

    private String firstName;

    private String middleName;

    private String lastName;

    private String email;

    private String contactNumber;

    private LocalDate dob;

    private Branch branch;

    private Integer passoutYear;

    private String company;

    private String jobRole;

    private BigDecimal currentPackage;

    private BigDecimal experience;

    private boolean emailVerified;

    private LocalDateTime emailVerifiedAt;
}
