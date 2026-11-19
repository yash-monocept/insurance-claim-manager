package com.insurance.insurancemgmt.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserStatusUpdateRequest(
        @NotBlank
        @Pattern(regexp = "(?i)^(true|false|active|inactive)$",
                 message = "Active must be one of: true, false, ACTIVE, INACTIVE")
        String active,
        @Size(max = 500) String reason
) {
}
