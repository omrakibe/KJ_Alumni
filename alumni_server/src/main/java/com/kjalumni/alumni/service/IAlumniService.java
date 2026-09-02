package com.kjalumni.alumni.service;

import com.kjalumni.alumni.dto.AlumniDashboardResponse;
import com.kjalumni.alumni.dto.AlumniProfileResponse;
import com.kjalumni.alumni.dto.AlumniProfileUpdateRequest;
import com.kjalumni.auth.entity.User;

public interface IAlumniService {
    AlumniDashboardResponse getDashboard(User currentUser);
    AlumniProfileResponse getProfile(User currentUser);
    AlumniProfileResponse updateProfile(User currentUser, AlumniProfileUpdateRequest request);
}
