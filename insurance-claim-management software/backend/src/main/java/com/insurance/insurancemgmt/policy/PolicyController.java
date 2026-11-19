package com.insurance.insurancemgmt.policy;

import com.insurance.insurancemgmt.common.dto.ApiResponse;
import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.policy.dto.PolicyPurchaseRequest;
import com.insurance.insurancemgmt.policy.dto.PolicyIssueRequest;
import com.insurance.insurancemgmt.policy.dto.PolicyResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @PostMapping("/purchase")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PolicyResponse>> purchasePolicy(@RequestBody @Valid PolicyPurchaseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Policy purchased successfully", policyService.purchasePolicy(request)));
    }

    @PostMapping("/issue")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<ApiResponse<PolicyResponse>> issuePolicy(@RequestBody @Valid PolicyIssueRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Policy issued successfully", policyService.issuePolicy(request)));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PageResponse<PolicyResponse>>> getMyPolicies(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PageResponse<PolicyResponse> response = policyService.getMyPolicies(page, size, sortField, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Policies retrieved successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<ApiResponse<PageResponse<PolicyResponse>>> getAllPolicies(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Policy.PolicyStatus status,
            @RequestParam(required = false) String productType,
            @RequestParam(required = false) Long customerId) {
        PageResponse<PolicyResponse> response =
                policyService.getAllPolicies(page, size, sortField, sortDir, status, productType, customerId);
        return ResponseEntity.ok(ApiResponse.success("Policies retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<PolicyResponse>> getPolicyById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Policy retrieved successfully", policyService.getPolicyById(id)));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<ApiResponse<PolicyResponse>> cancelPolicy(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Policy cancelled successfully", policyService.cancelPolicy(id)));
    }
}
