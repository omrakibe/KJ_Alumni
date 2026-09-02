package com.kjalumni.admin.dto;

import com.kjalumni.common.enums.Branch;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AlumniUpdateRequest {
    @NotBlank(message = "First name is required.")
    private String firstName;
    private String middleName;
    @NotBlank(message = "Last name is required.")
    private String lastName;
    @NotNull(message = "Branch is required.")
    private Branch branch;
    @NotNull(message = "Pass-out year is required.")
    @Min(value = 1900, message = "Pass-out year must be valid.")
    private Integer passoutYear;
    @NotBlank(message = "Contact number is required.")
    @Pattern(regexp = "^[0-9+() -]{7,20}$", message = "Invalid contact number.")
    private String contactNumber;
    @NotBlank(message = "Company is required.")
    private String company;
    @NotBlank(message = "Job role is required.")
    private String jobRole;
    @NotNull(message = "Current package is required.")
    @PositiveOrZero(message = "Current package cannot be negative.")
    private BigDecimal currentPackage;
    @NotNull(message = "Experience is required.")
    @PositiveOrZero(message = "Experience cannot be negative.")
    private BigDecimal experience;
}
