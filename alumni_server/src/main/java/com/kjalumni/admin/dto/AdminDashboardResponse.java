package com.kjalumni.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardResponse
{

    private long totalAlumni;

    private long activeAlumni;

    private long suspendedAlumni;

    private long pendingRegistrations;

    private Long totalAdmins;

    private Long activeAdmins;

    private long branchAlumni;

    private long branchPendingRegistrations;

    private Map<String, Long> alumniByBranch;

    private Map<Integer, Long> alumniByPassoutYear;
}
