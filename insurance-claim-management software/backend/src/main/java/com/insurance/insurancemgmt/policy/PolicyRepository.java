package com.insurance.insurancemgmt.policy;

import com.insurance.insurancemgmt.product.InsuranceProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {

    Optional<Policy> findByPolicyNumber(String policyNumber);

    boolean existsByPolicyNumber(String policyNumber);

    Page<Policy> findByCustomerId(Long customerId, Pageable pageable);

    @Query("SELECT p FROM Policy p " +
           "WHERE (:customerId IS NULL OR p.customer.id = :customerId) " +
           "AND (:status IS NULL OR p.policyStatus = :status) " +
           "AND (:productType IS NULL OR p.plan.product.productType = :productType)")
    Page<Policy> searchPolicies(@Param("customerId") Long customerId,
                                @Param("status") Policy.PolicyStatus status,
                                @Param("productType") InsuranceProduct.ProductType productType,
                                Pageable pageable);

    @Query("SELECT p FROM Policy p WHERE p.endDate < :today AND p.policyStatus != :expired AND p.policyStatus != :cancelled")
    List<Policy> findExpiredPolicies(@Param("today") LocalDate today,
                                     @Param("expired") Policy.PolicyStatus expired,
                                     @Param("cancelled") Policy.PolicyStatus cancelled);

    long countByCustomerId(Long customerId);

    long countByCustomerIdAndPolicyStatus(Long customerId, Policy.PolicyStatus status);

    long countByPolicyStatus(Policy.PolicyStatus status);

    @Query("SELECT COUNT(p) FROM Policy p WHERE p.endDate BETWEEN :start AND :end AND p.policyStatus != :expired AND p.policyStatus != :cancelled")
    long countByEndDateBetweenAndPolicyStatusNot(@Param("start") LocalDate start,
                                                 @Param("end") LocalDate end,
                                                 @Param("expired") Policy.PolicyStatus expired,
                                                 @Param("cancelled") Policy.PolicyStatus cancelled);

    @Query("SELECT p.plan.product.productType, COUNT(p) FROM Policy p GROUP BY p.plan.product.productType")
    List<Object[]> countPoliciesByProduct();

    @Query("SELECT YEAR(p.createdDate), MONTH(p.createdDate), COUNT(p) FROM Policy p " +
           "WHERE p.createdDate >= :startDate GROUP BY YEAR(p.createdDate), MONTH(p.createdDate) ORDER BY YEAR(p.createdDate), MONTH(p.createdDate)")
    List<Object[]> countPoliciesByMonth(@Param("startDate") java.time.LocalDateTime startDate);
}
