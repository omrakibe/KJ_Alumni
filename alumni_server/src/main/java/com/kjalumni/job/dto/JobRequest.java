package com.kjalumni.job.dto;

import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.EventVisibility;
import com.kjalumni.common.enums.JobType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class JobRequest {
    @NotBlank @Size(max = 180)
    private String title;

    @NotBlank @Size(max = 180)
    private String companyName;

    @NotBlank @Size(max = 10000)
    private String description;

    @NotBlank @Size(max = 180)
    private String location;

    @NotNull
    private JobType jobType;

    @NotBlank @Size(max = 120)
    private String experienceRequired;

    @NotBlank @Size(max = 1000)
    private String applicationDetails;

    @NotNull @FutureOrPresent
    private LocalDate deadline;

    @NotNull
    private EventVisibility visibility;

    private Branch targetBranch;
}
