package com.kjalumni.auth.dto;

import com.kjalumni.common.enums.Branch;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest
{

    @NotBlank(message = "First name is required")
    private String firstName;

    private String middleName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Invalid email address")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number")
    private String contactNumber;

    @NotNull(message = "Date of birth is required")
    private LocalDate dob;

    @NotNull(message = "Branch is required")
    private Branch branch;

    @NotNull(message = "Passout year is required")
    private Integer passoutYear;

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Job role is required")
    private String jobRole;

    @NotNull(message = "Package is required")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal currentPackage;

    @NotNull(message = "Experience is required")
    @DecimalMin(value = "0.0")
    private BigDecimal experience;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
