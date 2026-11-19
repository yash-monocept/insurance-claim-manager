package com.insurance.insurancemgmt.payment.dto;

import com.insurance.insurancemgmt.payment.PremiumPayment;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record PaymentRequest(
        @NotNull Long policyId,
        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal amount,
        @NotNull PremiumPayment.PaymentMode paymentMode,
        @NotBlank @Size(max = 100) String transactionReference,
        @NotNull PremiumPayment.PaymentStatus paymentStatus
) {
}
