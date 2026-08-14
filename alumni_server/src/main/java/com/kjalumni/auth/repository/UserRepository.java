package com.kjalumni.auth.repository;

import com.kjalumni.auth.entity.User;
import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.Role;
import com.kjalumni.common.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>
{

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findAllByRole(Role role);

    long countByRole(Role role);

    long countByRoleAndStatus(
            Role role,
            UserStatus status
    );

    long countByRoleAndBranch(
            Role role,
            Branch branch
    );

    long countByRoleAndBranchAndStatus(
            Role role,
            Branch branch,
            UserStatus status
    );
}
