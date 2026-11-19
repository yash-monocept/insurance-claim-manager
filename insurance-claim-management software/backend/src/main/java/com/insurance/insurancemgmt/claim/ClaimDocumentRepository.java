package com.insurance.insurancemgmt.claim;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClaimDocumentRepository extends JpaRepository<ClaimDocument, Long> {

    @Query("SELECT d FROM ClaimDocument d WHERE d.claim.id = :claimId ORDER BY d.uploadedDate DESC")
    Page<ClaimDocument> findByClaimId(@Param("claimId") Long claimId, Pageable pageable);
}
