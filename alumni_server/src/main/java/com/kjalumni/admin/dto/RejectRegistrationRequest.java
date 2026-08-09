package com.kjalumni.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RejectRegistrationRequest
{

    @NotBlank(message = "Rejection reason is required")
    private String reason;
}