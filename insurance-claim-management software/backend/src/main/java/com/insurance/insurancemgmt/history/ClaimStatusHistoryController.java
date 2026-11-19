package com.insurance.insurancemgmt.history;

import com.insurance.insurancemgmt.claim.Claim.ClaimStatus;
import com.insurance.insurancemgmt.common.dto.ApiResponse;
import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.history.dto.ClaimStatusHistoryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/claims/{claimId}/history")
public class ClaimStatusHistoryController {

    private final ClaimStatusHistoryService historyService;

    public ClaimStatusHistoryController(ClaimStatusHistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<PageResponse<ClaimStatusHistoryResponse>>> getHistory(
            @PathVariable Long claimId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "updatedDate") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String updatedBy,
            @RequestParam(required = false) ClaimStatus status) {
        PageResponse<ClaimStatusHistoryResponse> response =
                historyService.getClaimHistory(claimId, page, size, sortField, sortDir, updatedBy, status);
        return ResponseEntity.ok(ApiResponse.success("Claim history retrieved successfully", response));
    }
}
