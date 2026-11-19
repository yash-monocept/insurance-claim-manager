package com.insurance.insurancemgmt.plan;

import com.insurance.insurancemgmt.product.InsuranceProduct;
import com.insurance.insurancemgmt.product.InsuranceProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class PlanReadService {

    private final PolicyPlanRepository planRepository;
    private final InsuranceProductRepository productRepository;

    public PlanReadService(PolicyPlanRepository planRepository, InsuranceProductRepository productRepository) {
        this.planRepository = planRepository;
        this.productRepository = productRepository;
    }

    public Page<PolicyPlan> getActivePlans(Pageable pageable) {
        return planRepository.findByActiveTrue(pageable);
    }

    public Page<PolicyPlan> getActivePlansByProduct(Long productId, Pageable pageable) {
        return planRepository.findByProductIdAndActiveTrue(productId, pageable);
    }

    public PolicyPlan getPlanById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new com.insurance.insurancemgmt.common.exception.ResourceNotFoundException("Plan not found with id: " + id));
    }

    public List<InsuranceProduct> getActiveProducts() {
        return productRepository.findByActiveTrue(org.springframework.data.domain.Pageable.unpaged()).getContent();
    }
}
