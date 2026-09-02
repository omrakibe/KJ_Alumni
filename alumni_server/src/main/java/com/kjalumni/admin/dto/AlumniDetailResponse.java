package com.kjalumni.admin.dto;

import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AlumniDetailResponse {
    private UUID id;
    private String alumniId;
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
    private UserStatus status;
}
