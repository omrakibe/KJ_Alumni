package com.kjalumni.alumni.dto;

import com.kjalumni.common.enums.Branch;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AlumniProfileResponse {
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
}
