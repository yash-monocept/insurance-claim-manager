package com.insurance.insurancemgmt.plan;

import com.insurance.insurancemgmt.common.dto.ApiResponse;
import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.plan.dto.PlanRequest;
import com.insurance.insurancemgmt.plan.dto.PlanResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/plans")
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<PageResponse<PlanResponse>>> getAllPlans(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Boolean active) {
        PageResponse<PlanResponse> response = planService.getAllPlans(page, size, sortField, sortDir, productId, active);
        return ResponseEntity.ok(ApiResponse.success("Plans retrieved successfully", response));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PlanResponse>> createPlan(@RequestBody @Valid PlanRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Plan created successfully", planService.createPlan(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PlanResponse>> updatePlan(@PathVariable Long id,
                                                                @RequestBody @Valid PlanRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Plan updated successfully", planService.updatePlan(id, request)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PlanResponse>> togglePlanStatus(@PathVariable Long id,
                                                                      @RequestParam Boolean active) {
        return ResponseEntity.ok(ApiResponse.success("Plan status updated successfully",
                planService.togglePlanStatus(id, active)));
    }
}
