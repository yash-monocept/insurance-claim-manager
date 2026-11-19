package com.insurance.insurancemgmt.product;

import com.insurance.insurancemgmt.common.dto.ApiResponse;
import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.product.dto.ProductRequest;
import com.insurance.insurancemgmt.product.dto.ProductResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) InsuranceProduct.ProductType type,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String keyword) {
        PageResponse<ProductResponse> response =
                productService.getAllProducts(page, size, sortField, sortDir, type, active, keyword);
        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@RequestBody @Valid ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", productService.createProduct(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id,
                                                                      @RequestBody @Valid ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", productService.updateProduct(id, request)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ProductResponse>> toggleProductStatus(@PathVariable Long id,
                                                                            @RequestParam Boolean active) {
        ProductResponse result = active ? productService.activateProduct(id) : productService.deactivateProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product status updated successfully", result));
    }
}
