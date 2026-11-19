package com.insurance.insurancemgmt.plan;

import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.common.exception.BusinessException;
import com.insurance.insurancemgmt.common.exception.ResourceNotFoundException;
import com.insurance.insurancemgmt.common.util.QueryValidator;
import com.insurance.insurancemgmt.product.InsuranceProduct;
import com.insurance.insurancemgmt.product.InsuranceProductRepository;
import com.insurance.insurancemgmt.plan.dto.PlanRequest;
import com.insurance.insurancemgmt.plan.dto.PlanResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@Transactional
public class PlanService {

    private static final Logger log = LoggerFactory.getLogger(PlanService.class);

    private static final Set<String> SORTABLE_FIELDS = Set.of(
            "id", "planName", "coverageAmount", "premiumAmount", "premiumType",
            "durationYears", "active", "createdDate", "updatedDate");

    private final PolicyPlanRepository planRepository;
    private final InsuranceProductRepository productRepository;

    public PlanService(PolicyPlanRepository planRepository, InsuranceProductRepository productRepository) {
        this.planRepository = planRepository;
        this.productRepository = productRepository;
    }

    public PageResponse<PlanResponse> getAllPlans(int page, int size, String sortField, String sortDir,
                                                  Long productId, Boolean active) {
        QueryValidator.validatePagination(page, size);
        Sort sort = QueryValidator.buildSort(sortField, sortDir, SORTABLE_FIELDS);
        PageRequest pageable = PageRequest.of(page - 1, size, sort);

        Boolean effectiveActive = active;
        // Customers and agents only see active plans unless they ask otherwise (FR-PLN-004).
        if (effectiveActive == null && !currentUserIsStaff()) {
            effectiveActive = Boolean.TRUE;
        }

        Page<PolicyPlan> pageResult = planRepository.searchPlans(productId, effectiveActive, pageable);

        return PageResponse.of(
                pageResult.getContent().stream().map(PlanResponse::fromEntity).toList(),
                pageResult.getNumber() + 1,
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast(),
                sortField,
                QueryValidator.normalizeDirection(sortDir)
        );
    }

    public PlanResponse createPlan(PlanRequest request) {
        InsuranceProduct product = requireActiveProduct(request.productId());
        validatePlan(request);

        PolicyPlan plan = new PolicyPlan();
        plan.setProduct(product);
        plan.setPlanName(request.planName());
        plan.setCoverageAmount(request.coverageAmount());
        plan.setPremiumAmount(request.premiumAmount());
        plan.setPremiumType(request.premiumType());
        plan.setDurationYears(request.durationYears());
        plan.setTermsAndConditions(request.termsAndConditions());
        plan.setActive(request.active() != null ? request.active() : true);

        PolicyPlan saved = planRepository.save(plan);
        log.info("Plan created: planName={} product={} coverage={} premium={}",
                saved.getPlanName(), product.getProductName(),
                saved.getCoverageAmount(), saved.getPremiumAmount());
        return PlanResponse.fromEntity(saved);
    }

    public PlanResponse updatePlan(Long id, PlanRequest request) {
        PolicyPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + id));
        InsuranceProduct product = requireActiveProduct(request.productId());
        validatePlan(request);

        plan.setProduct(product);
        plan.setPlanName(request.planName());
        plan.setCoverageAmount(request.coverageAmount());
        plan.setPremiumAmount(request.premiumAmount());
        plan.setPremiumType(request.premiumType());
        plan.setDurationYears(request.durationYears());
        plan.setTermsAndConditions(request.termsAndConditions());
        plan.setActive(request.active() != null ? request.active() : plan.getActive());

        PolicyPlan saved = planRepository.save(plan);
        log.info("Plan updated: planName={} product={} active={}",
                saved.getPlanName(), product.getProductName(), saved.getActive());
        return PlanResponse.fromEntity(saved);
    }

    public PlanResponse togglePlanStatus(Long id, Boolean active) {
        PolicyPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + id));
        if (Boolean.TRUE.equals(active) && !Boolean.TRUE.equals(plan.getProduct().getActive())) {
            throw new BusinessException("Cannot activate a plan whose product is inactive",
                    "INACTIVE_PRODUCT", 400);
        }
        plan.setActive(active);
        PolicyPlan saved = planRepository.save(plan);
        log.info("Plan status updated: planName={} active={}", saved.getPlanName(), active);
        return PlanResponse.fromEntity(saved);
    }

    public PolicyPlan getPlanById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + id));
    }

    private InsuranceProduct requireActiveProduct(Long productId) {
        InsuranceProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        if (!Boolean.TRUE.equals(product.getActive())) {
            throw new BusinessException("Cannot use an inactive product for a plan",
                    "INACTIVE_PRODUCT", 400);
        }
        return product;
    }

    private void validatePlan(PlanRequest request) {
        if (request.coverageAmount().compareTo(request.premiumAmount()) <= 0) {
            throw new BusinessException("Coverage amount must be higher than premium amount",
                    "INVALID_PLAN", 400);
        }
        if (request.durationYears() == null || request.durationYears() <= 0) {
            throw new BusinessException("Duration must be greater than zero",
                    "INVALID_PLAN", 400);
        }
    }

    private boolean currentUserIsStaff() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream().anyMatch(authority ->
                authority.getAuthority().equals("ROLE_ADMIN") || authority.getAuthority().equals("ROLE_AGENT"));
    }
}
