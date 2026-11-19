package com.insurance.insurancemgmt.common.dto;

public record AuthResponse(
        String token,
        String tokenType,
        String email,
        String role,
        String fullName,
        String mobileNumber,
        Boolean active,
        Long expiryTime
) {
}
