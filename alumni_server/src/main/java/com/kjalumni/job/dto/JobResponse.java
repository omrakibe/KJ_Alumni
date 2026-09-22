package com.kjalumni.job.dto;

import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.EventVisibility;
import com.kjalumni.common.enums.JobType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private UUID id;
    private String title;
    private String companyName;
    private String description;
    private String location;
    private JobType jobType;
    private String experienceRequired;
    private String applicationDetails;
    private LocalDate deadline;
    private EventVisibility visibility;
    private Branch targetBranch;
    private UUID createdBy;
    private String postedByName;
    private String postedByAlumniId;
    private String postedByEmail;
    private LocalDateTime createdAt;
    private boolean ownedByCurrentUser;
}
