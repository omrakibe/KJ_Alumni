package com.kjalumni.admin.dto;

import com.kjalumni.common.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlumniStatusUpdateRequest {
    @NotNull(message = "Status is required.")
    private UserStatus status;
}
