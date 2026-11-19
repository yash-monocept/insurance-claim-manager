package com.insurance.insurancemgmt.product;

import com.insurance.insurancemgmt.common.dto.ApiResponse;
import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.product.dto.ProductResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Read-only catalogue of active products, available to any authenticated user.
 */
@RestController
@RequestMapping("/api/products")
public class ProductPublicController {

    private final ProductService productService;

    public ProductPublicController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getActiveProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) InsuranceProduct.ProductType type,
            @RequestParam(required = false) String keyword) {
        PageResponse<ProductResponse> response =
                productService.getActiveProducts(page, size, sortField, sortDir, type, keyword);
        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", response));
    }
}
