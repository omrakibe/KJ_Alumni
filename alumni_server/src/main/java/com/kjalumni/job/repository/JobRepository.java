package com.kjalumni.job.repository;

import com.kjalumni.auth.entity.User;
import com.kjalumni.common.enums.Branch;
import com.kjalumni.job.entity.JobPosting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.UUID;

public interface JobRepository extends JpaRepository<JobPosting, UUID> {
    @EntityGraph(attributePaths = "createdBy")
    @Query("""
            select j from JobPosting j
            where j.deadline >= :today
              and (j.visibility = com.kjalumni.common.enums.EventVisibility.ALL or j.targetBranch = :branch)
              and (:search = '' or lower(j.title) like lower(concat('%', :search, '%'))
                   or lower(j.companyName) like lower(concat('%', :search, '%'))
                   or lower(j.location) like lower(concat('%', :search, '%'))
                   or lower(j.postedByName) like lower(concat('%', :search, '%'))
                   or lower(j.postedByAlumniId) like lower(concat('%', :search, '%')))
            """)
    Page<JobPosting> findVisibleToBranch(@Param("branch") Branch branch,
                                         @Param("today") LocalDate today,
                                         @Param("search") String search,
                                         Pageable pageable);

    @EntityGraph(attributePaths = "createdBy")
    @Query("""
            select j from JobPosting j
            where j.deadline >= :today
              and (:search = '' or lower(j.title) like lower(concat('%', :search, '%'))
                   or lower(j.companyName) like lower(concat('%', :search, '%'))
                   or lower(j.location) like lower(concat('%', :search, '%'))
                   or lower(j.postedByName) like lower(concat('%', :search, '%'))
                   or lower(j.postedByAlumniId) like lower(concat('%', :search, '%')))
            """)
    Page<JobPosting> findAllCurrent(@Param("today") LocalDate today,
                                    @Param("search") String search,
                                    Pageable pageable);

    @EntityGraph(attributePaths = "createdBy")
    @Query("""
            select j from JobPosting j
            where j.createdBy = :user and j.deadline >= :today
              and (:search = '' or lower(j.title) like lower(concat('%', :search, '%'))
                   or lower(j.companyName) like lower(concat('%', :search, '%')))
            """)
    Page<JobPosting> findCurrentByOwner(@Param("user") User user,
                                        @Param("today") LocalDate today,
                                        @Param("search") String search,
                                        Pageable pageable);

    long deleteByDeadlineBefore(LocalDate today);
}
