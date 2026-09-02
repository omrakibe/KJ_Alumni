package com.kjalumni.alumni.repository;

import com.kjalumni.alumni.entity.Alumni;
import com.kjalumni.auth.entity.User;
import com.kjalumni.common.enums.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

public interface AlumniRepository extends JpaRepository<Alumni, UUID>, JpaSpecificationExecutor<Alumni>
{

    @Override
    @EntityGraph(attributePaths = "user")
    Page<Alumni> findAll(Specification<Alumni> specification, Pageable pageable);

    Optional<Alumni> findByUser(User user);

    Optional<Alumni> findByIdAndUser_Branch(UUID id, Branch branch);

    boolean existsByContactNumber(String contactNumber);

    Optional<Alumni> findTopByBranchAndPassoutYearOrderByAlumniIdDesc(
            Branch branch,
            Integer passoutYear
    );

    long countByBranch(Branch branch);

    @Query("select a.branch, count(a) from Alumni a group by a.branch")
    List<Object[]> countGroupedByBranch();

    @Query("select a.passoutYear, count(a) from Alumni a group by a.passoutYear order by a.passoutYear desc")
    List<Object[]> countGroupedByPassoutYear();

    @Query("select a.passoutYear, count(a) from Alumni a where a.branch = :branch group by a.passoutYear order by a.passoutYear desc")
    List<Object[]> countGroupedByBranchAndPassoutYear(Branch branch);
}
