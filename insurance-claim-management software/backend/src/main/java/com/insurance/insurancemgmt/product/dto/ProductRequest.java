package com.insurance.insurancemgmt.product.dto;

import com.insurance.insurancemgmt.product.InsuranceProduct;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProductRequest(
        @NotBlank @Size(max = 100) String productName,
        @NotNull(message = "Product type is required") InsuranceProduct.ProductType productType,
        @NotBlank @Size(max = 500) String description,
        Boolean active
) {
}
