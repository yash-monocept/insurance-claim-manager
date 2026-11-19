package com.insurance.insurancemgmt.policy.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PolicyIssueRequest(
        @NotNull Long customerId,
        @NotNull Long planId,
        @FutureOrPresent(message = "Start date must be today or a future date") LocalDate startDate
) {
}

