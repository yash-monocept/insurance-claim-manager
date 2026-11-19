package com.insurance.insurancemgmt.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AgentCreationRequest(
        @NotBlank @Size(max = 100) String fullName,
        @NotBlank @Email @Size(max = 150) String email,
        @NotBlank
        @Size(min = 8, max = 255, message = "Password must be at least 8 characters long")
        String password,
        @NotBlank
        @Pattern(regexp = "^[0-9+\\- ]{7,20}$", message = "Mobile number must be 7 to 20 digits")
        String mobileNumber
) {
}
