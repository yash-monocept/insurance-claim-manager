package com.insurance.insurancemgmt.product;

import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.common.exception.DuplicateResourceException;
import com.insurance.insurancemgmt.common.exception.ResourceNotFoundException;
import com.insurance.insurancemgmt.common.util.QueryValidator;
import com.insurance.insurancemgmt.product.dto.ProductRequest;
import com.insurance.insurancemgmt.product.dto.ProductResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@Transactional
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    private static final Set<String> SORTABLE_FIELDS = Set.of(
            "id", "productName", "productType", "active", "createdDate", "updatedDate");

    private final InsuranceProductRepository productRepository;

    public ProductService(InsuranceProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public PageResponse<ProductResponse> getAllProducts(int page, int size, String sortField, String sortDir,
                                                        InsuranceProduct.ProductType type, Boolean active,
                                                        String keyword) {
        QueryValidator.validatePagination(page, size);
        Sort sort = QueryValidator.buildSort(sortField, sortDir, SORTABLE_FIELDS);
        PageRequest pageable = PageRequest.of(page - 1, size, sort);

        Page<InsuranceProduct> pageResult = productRepository.searchProducts(type, active, keyword, pageable);

        return PageResponse.of(
                pageResult.getContent().stream().map(ProductResponse::fromEntity).toList(),
                pageResult.getNumber() + 1,
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast(),
                sortField,
                QueryValidator.normalizeDirection(sortDir)
        );
    }

    /**
     * Read-only catalogue of active products for any authenticated user.
     */
    public PageResponse<ProductResponse> getActiveProducts(int page, int size, String sortField, String sortDir,
                                                           InsuranceProduct.ProductType type, String keyword) {
        return getAllProducts(page, size, sortField, sortDir, type, Boolean.TRUE, keyword);
    }

    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsByProductName(request.productName())) {
            throw new DuplicateResourceException("Product name already exists: " + request.productName());
        }
        InsuranceProduct product = new InsuranceProduct();
        product.setProductName(request.productName());
        product.setProductType(request.productType());
        product.setDescription(request.description());
        product.setActive(request.active() != null ? request.active() : true);

        InsuranceProduct saved = productRepository.save(product);
        log.info("Product created: productName={} type={} active={}",
                saved.getProductName(), saved.getProductType(), saved.getActive());
        return ProductResponse.fromEntity(saved);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        InsuranceProduct product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        productRepository.findByProductName(request.productName())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new DuplicateResourceException(
                            "Product name already exists: " + request.productName());
                });

        product.setProductName(request.productName());
        product.setProductType(request.productType());
        product.setDescription(request.description());
        product.setActive(request.active() != null ? request.active() : product.getActive());

        InsuranceProduct saved = productRepository.save(product);
        log.info("Product updated: productName={} type={} active={}",
                saved.getProductName(), saved.getProductType(), saved.getActive());
        return ProductResponse.fromEntity(saved);
    }

    public ProductResponse deactivateProduct(Long id) {
        InsuranceProduct product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setActive(false);
        InsuranceProduct saved = productRepository.save(product);
        log.info("Product deactivated: productName={}", saved.getProductName());
        return ProductResponse.fromEntity(saved);
    }

    public ProductResponse activateProduct(Long id) {
        InsuranceProduct product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setActive(true);
        InsuranceProduct saved = productRepository.save(product);
        log.info("Product activated: productName={}", saved.getProductName());
        return ProductResponse.fromEntity(saved);
    }
}
