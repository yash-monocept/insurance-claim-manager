package com.insurance.insurancemgmt.history;

import com.insurance.insurancemgmt.claim.Claim;
import com.insurance.insurancemgmt.claim.Claim.ClaimStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimStatusHistoryRepository extends JpaRepository<ClaimStatusHistory, Long> {

    @Query("SELECT h FROM ClaimStatusHistory h WHERE h.claim.id = :claimId ORDER BY h.updatedDate DESC")
    Page<ClaimStatusHistory> findByClaimId(@Param("claimId") Long claimId, Pageable pageable);

    @Query("SELECT h FROM ClaimStatusHistory h WHERE h.claim.id = :claimId ORDER BY h.updatedDate ASC")
    List<ClaimStatusHistory> findByClaimIdOrderByUpdatedDateAsc(@Param("claimId") Long claimId);

    @Query("SELECT h FROM ClaimStatusHistory h LEFT JOIN h.updatedByUser u WHERE h.claim.id = :claimId " +
           "AND (:updatedBy IS NULL OR u.email = :updatedBy) " +
           "AND (:status IS NULL OR h.newStatus = :status)")
    Page<ClaimStatusHistory> searchHistory(@Param("claimId") Long claimId,
                                           @Param("updatedBy") String updatedBy,
                                           @Param("status") ClaimStatus status,
                                           Pageable pageable);
}
