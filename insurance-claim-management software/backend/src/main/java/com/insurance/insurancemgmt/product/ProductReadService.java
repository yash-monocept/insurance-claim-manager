package com.insurance.insurancemgmt.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProductReadService {

    private final InsuranceProductRepository productRepository;

    public ProductReadService(InsuranceProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<InsuranceProduct> getActiveProducts(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable);
    }

    public InsuranceProduct getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new com.insurance.insurancemgmt.common.exception.ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<InsuranceProduct> getAllActiveProducts() {
        return productRepository.findByActiveTrue(org.springframework.data.domain.Pageable.unpaged()).getContent();
    }
}
