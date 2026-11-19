package com.insurance.insurancemgmt.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    java.util.List<User> findByRole(User.Role role);

    boolean existsByEmail(String email);

    Page<User> findAllByRole(User.Role role, Pageable pageable);

    Page<User> findAllByRoleAndActive(User.Role role, Boolean active, Pageable pageable);

    @Query("SELECT u FROM User u WHERE (LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:role IS NULL OR u.role = :role) " +
           "AND (:active IS NULL OR u.active = :active)")
    Page<User> searchUsers(@Param("keyword") String keyword,
                           @Param("role") User.Role role,
                           @Param("active") Boolean active,
                           Pageable pageable);

    long countByRole(User.Role role);
}
