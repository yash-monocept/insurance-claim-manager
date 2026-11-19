package com.insurance.insurancemgmt.claim;

import com.insurance.insurancemgmt.policy.Policy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    Optional<Claim> findByClaimNumber(String claimNumber);

    boolean existsByClaimNumber(String claimNumber);

    Page<Claim> findByPolicyCustomerId(Long customerId, Pageable pageable);

    @Query("SELECT c FROM Claim c " +
           "WHERE (:customerId IS NULL OR c.policy.customer.id = :customerId) " +
           "AND (:status IS NULL OR c.claimStatus = :status)")
    Page<Claim> searchClaims(@Param("customerId") Long customerId,
                             @Param("status") Claim.ClaimStatus status,
                             Pageable pageable);

    @Query("SELECT c FROM Claim c WHERE c.policy.id = :policyId ORDER BY c.createdDate DESC")
    List<Claim> findByPolicyIdOrderByCreatedDateDesc(@Param("policyId") Long policyId);

    @Query("SELECT COUNT(c) FROM Claim c WHERE c.claimStatus = :status")
    Long countByStatus(Claim.ClaimStatus status);

    Page<Claim> findByPolicyCustomerIdAndClaimStatus(Long customerId, Claim.ClaimStatus status, Pageable pageable);

    Page<Claim> findByClaimStatus(Claim.ClaimStatus status, Pageable pageable);

    long countByPolicyCustomerId(Long customerId);

    long countByPolicyCustomerIdAndClaimStatus(Long customerId, Claim.ClaimStatus status);
}
