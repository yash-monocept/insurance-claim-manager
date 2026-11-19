package com.insurance.insurancemgmt.plan.dto;

import com.insurance.insurancemgmt.plan.PolicyPlan;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record PlanRequest(
        @NotNull Long productId,
        @NotBlank @Size(max = 100) String planName,
        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal coverageAmount,
        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal premiumAmount,
        @NotNull(message = "Premium type is required") PolicyPlan.PremiumType premiumType,
        @NotNull @Min(value = 1, message = "Duration must be greater than zero") Integer durationYears,
        @NotBlank @Size(max = 1000) String termsAndConditions,
        Boolean active
) {
}
