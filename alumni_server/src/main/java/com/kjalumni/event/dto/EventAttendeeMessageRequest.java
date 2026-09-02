package com.kjalumni.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EventAttendeeMessageRequest {
    @NotBlank(message = "Message is required.")
    @Size(max = 3000, message = "Message must not exceed 3000 characters.")
    private String message;
}
