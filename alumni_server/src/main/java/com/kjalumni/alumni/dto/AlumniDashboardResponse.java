package com.kjalumni.alumni.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AlumniDashboardResponse {
    private AlumniProfileResponse profile;
}
