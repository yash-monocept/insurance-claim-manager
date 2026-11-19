package com.insurance.insurancemgmt.plan;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyPlanRepository extends JpaRepository<PolicyPlan, Long> {

    List<PolicyPlan> findByProductId(Long productId);

    Page<PolicyPlan> findByProductIdAndActiveTrue(Long productId, Pageable pageable);

    Page<PolicyPlan> findByActiveTrue(Pageable pageable);

    Page<PolicyPlan> findAllByActive(Boolean active, Pageable pageable);

    @Query("SELECT p FROM PolicyPlan p " +
           "WHERE (:productId IS NULL OR p.product.id = :productId) " +
           "AND (:active IS NULL OR p.active = :active)")
    Page<PolicyPlan> searchPlans(@Param("productId") Long productId,
                                 @Param("active") Boolean active,
                                 Pageable pageable);
}
