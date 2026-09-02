package com.kjalumni.alumni.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AlumniProfileUpdateRequest {
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
