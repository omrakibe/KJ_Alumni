package com.kjalumni.alumni.repository;

import com.kjalumni.alumni.entity.Alumni;
import com.kjalumni.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AlumniRepository extends JpaRepository<Alumni, UUID>
{

    Optional<Alumni> findByUser(User user);

    boolean existsByContactNumber(String contactNumber);

}
