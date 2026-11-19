package com.insurance.insurancemgmt.customer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CustomerRequest(
        @NotNull(message = "Date of birth is required")
        @Past(message = "Date of birth must be a past date") LocalDate dateOfBirth,
        @NotBlank @Size(max = 255) String address,
        @NotBlank @Size(max = 100) String city,
        @NotBlank @Size(max = 100) String state,
        @NotBlank
        @Pattern(regexp = "^[0-9]{4,10}$", message = "PIN code must be 4 to 10 digits")
        String pinCode,
        @NotBlank @Size(max = 100) String nomineeName,
        @NotBlank @Size(max = 50) String nomineeRelation
) {
}
