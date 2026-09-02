package com.kjalumni.admin.dto;

import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminListResponse {
    private UUID id;
    private String email;
    private Branch branch;
    private UserStatus status;
}
