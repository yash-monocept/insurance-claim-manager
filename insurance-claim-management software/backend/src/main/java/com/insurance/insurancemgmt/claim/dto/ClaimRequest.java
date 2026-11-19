package com.insurance.insurancemgmt.claim.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ClaimRequest(
        @NotNull Long policyId,
        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal claimAmount,
        @NotBlank @Size(max = 1000) String claimReason,
        @NotNull @PastOrPresent(message = "Incident date cannot be a future date") LocalDate incidentDate,
        @NotBlank @Size(max = 200) String documentName,
        @Size(max = 100) String documentType,
        @NotBlank @Size(max = 500) String documentReference
) {
}
