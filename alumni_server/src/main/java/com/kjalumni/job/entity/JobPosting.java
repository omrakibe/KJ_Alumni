package com.kjalumni.job.entity;

import com.kjalumni.auth.entity.User;
import com.kjalumni.common.entity.BaseEntity;
import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.EventVisibility;
import com.kjalumni.common.enums.JobType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "job_postings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobPosting extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(nullable = false, length = 180)
    private String companyName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 180)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private JobType jobType;

    @Column(nullable = false, length = 120)
    private String experienceRequired;

    @Column(nullable = false, length = 1000)
    private String applicationDetails;

    @Column(nullable = false)
    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EventVisibility visibility;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Branch targetBranch;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(nullable = false, length = 240)
    private String postedByName;

    @Column(nullable = false, length = 50)
    private String postedByAlumniId;
}
