package com.insurance.insurancemgmt.claim.dto;

import com.insurance.insurancemgmt.claim.Claim;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ClaimRecommendationRequest(
        @NotNull Claim.ClaimStatus recommendedStatus,
        @NotBlank @Size(max = 1000) String remarks
) {
}

