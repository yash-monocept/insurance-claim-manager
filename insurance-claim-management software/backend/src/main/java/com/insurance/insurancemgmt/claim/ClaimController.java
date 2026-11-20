package com.insurance.insurancemgmt.claim;

import com.insurance.insurancemgmt.claim.Claim.ClaimStatus;
import com.insurance.insurancemgmt.common.dto.ApiResponse;
import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.claim.dto.ClaimDocumentResponse;
import com.insurance.insurancemgmt.claim.dto.ClaimRequest;
import com.insurance.insurancemgmt.claim.dto.ClaimResponse;
import com.insurance.insurancemgmt.claim.dto.ClaimReviewRequest;
import com.insurance.insurancemgmt.claim.dto.ClaimRecommendationRequest;
import com.insurance.insurancemgmt.claim.dto.ClaimDecisionRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<ClaimResponse>> submitClaim(@RequestBody @Valid ClaimRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Claim submitted successfully", claimService.submitClaim(request)));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PageResponse<ClaimResponse>>> getMyClaims(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) ClaimStatus status) {
        PageResponse<ClaimResponse> response = claimService.getMyClaims(page, size, sortField, sortDir, status);
        return ResponseEntity.ok(ApiResponse.success("Claims retrieved successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<ApiResponse<PageResponse<ClaimResponse>>> getAllClaims(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) ClaimStatus status,
            @RequestParam(required = false) Long customerId) {
        PageResponse<ClaimResponse> response =
                claimService.getAllClaims(page, size, sortField, sortDir, status, customerId);
        return ResponseEntity.ok(ApiResponse.success("Claims retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<ClaimResponse>> getClaimById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Claim retrieved successfully", claimService.getClaimById(id)));
    }

    @PatchMapping("/{id}/review")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<ApiResponse<ClaimResponse>> reviewClaim(@PathVariable Long id,
                                                                  @RequestBody @Valid ClaimReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Claim reviewed successfully", claimService.reviewClaim(id, request)));
    }

    @PatchMapping("/{id}/recommendation")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<ApiResponse<ClaimResponse>> recommendClaim(@PathVariable Long id,
                                                                     @RequestBody @Valid ClaimRecommendationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Claim recommendation recorded", claimService.recommendClaim(id, request)));
    }

    @PatchMapping("/{id}/decision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ClaimResponse>> decideClaim(@PathVariable Long id,
                                                                  @RequestBody @Valid ClaimDecisionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Claim decision recorded", claimService.decideClaim(id, request)));
    }

    @GetMapping("/{id}/documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<java.util.List<ClaimDocumentResponse>>> getClaimDocuments(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Claim documents retrieved",
                claimService.getClaimDocuments(id)));
    }
}
