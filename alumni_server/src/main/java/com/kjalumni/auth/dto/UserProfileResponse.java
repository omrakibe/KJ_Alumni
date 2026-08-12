package com.kjalumni.auth.dto;

import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.Role;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class UserProfileResponse
{

    private UUID id;
    private String email;
    private Role role;
    private Branch branch;
}