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
public class AlumniListResponse
{
    private UUID id;

    private UUID userId;

    private String firstName;

    private String middleName;

    private String lastName;

    private String email;

    private String contactNumber;

    private Branch branch;

    private Integer passoutYear;

    private String company;

    private String jobRole;

    private UserStatus status;
}
