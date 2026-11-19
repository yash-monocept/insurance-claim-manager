package com.insurance.insurancemgmt.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InsuranceProductRepository extends JpaRepository<InsuranceProduct, Long> {

    Optional<InsuranceProduct> findByProductName(String productName);

    boolean existsByProductName(String productName);

    Page<InsuranceProduct> findByActiveTrue(Pageable pageable);

    @Query("SELECT p FROM InsuranceProduct p " +
           "WHERE (:type IS NULL OR p.productType = :type) " +
           "AND (:active IS NULL OR p.active = :active) " +
           "AND (:keyword IS NULL OR :keyword = '' OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<InsuranceProduct> searchProducts(@Param("type") InsuranceProduct.ProductType type,
                                          @Param("active") Boolean active,
                                          @Param("keyword") String keyword,
                                          Pageable pageable);

    @Query("SELECT p.productType, COUNT(p) FROM InsuranceProduct p GROUP BY p.productType")
    List<Object[]> countPoliciesByProduct();
}
