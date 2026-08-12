package com.kjalumni.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResendOtpRequest
{

    @Email(message = "Invalid email address")
    @NotBlank(message = "Email is required")
    private String email;
}
