package com.insurance.insurancemgmt.policy.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PolicyPurchaseRequest(
        @NotNull Long planId,
        @FutureOrPresent(message = "Start date must be today or a future date") LocalDate startDate
) {
}

