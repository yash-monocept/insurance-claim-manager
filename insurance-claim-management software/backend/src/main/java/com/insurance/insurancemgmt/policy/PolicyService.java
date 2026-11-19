package com.insurance.insurancemgmt.policy;

import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.common.exception.AccessDeniedBusinessException;
import com.insurance.insurancemgmt.common.exception.BusinessException;
import com.insurance.insurancemgmt.common.exception.ResourceNotFoundException;
import com.insurance.insurancemgmt.common.util.QueryValidator;
import com.insurance.insurancemgmt.customer.Customer;
import com.insurance.insurancemgmt.customer.CustomerRepository;
import com.insurance.insurancemgmt.plan.PolicyPlan;
import com.insurance.insurancemgmt.plan.PolicyPlanRepository;
import com.insurance.insurancemgmt.payment.PremiumPaymentRepository;
import com.insurance.insurancemgmt.policy.dto.PolicyIssueRequest;
import com.insurance.insurancemgmt.policy.dto.PolicyPurchaseRequest;
import com.insurance.insurancemgmt.policy.dto.PolicyResponse;
import com.insurance.insurancemgmt.product.InsuranceProduct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class PolicyService {

    private static final Logger log = LoggerFactory.getLogger(PolicyService.class);

    private static final Set<String> SORTABLE_FIELDS = Set.of(
            "id", "policyNumber", "startDate", "endDate", "policyStatus",
            "totalPremiumPaid", "createdDate", "updatedDate");

    private final PolicyRepository policyRepository;
    private final CustomerRepository customerRepository;
    private final PolicyPlanRepository planRepository;
    private final PremiumPaymentRepository paymentRepository;

    public PolicyService(PolicyRepository policyRepository,
                         CustomerRepository customerRepository,
                         PolicyPlanRepository planRepository,
                         PremiumPaymentRepository paymentRepository) {
        this.policyRepository = policyRepository;
        this.customerRepository = customerRepository;
        this.planRepository = planRepository;
        this.paymentRepository = paymentRepository;
    }

    private String generatePolicyNumber() {
        return "POL-" + System.currentTimeMillis();
    }

    private String currentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private boolean currentUserIsCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_CUSTOMER"));
    }

    public PolicyResponse purchasePolicy(PolicyPurchaseRequest request) {
        String email = currentUserEmail();
        Customer customer = customerRepository.findByUser_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));

        requireCompleteProfile(customer);

        PolicyPlan plan = planRepository.findById(request.planId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + request.planId()));
        if (!plan.getActive()) {
            throw new BusinessException("Plan is not active", "INACTIVE_PLAN", 400);
        }

        LocalDate endDate = request.startDate().plusYears(plan.getDurationYears());

        Policy policy = new Policy();
        policy.setPolicyNumber(generatePolicyNumber());
        policy.setCustomer(customer);
        policy.setPlan(plan);
        policy.setStartDate(request.startDate());
        policy.setEndDate(endDate);
        policy.setPolicyStatus(Policy.PolicyStatus.PENDING_PAYMENT);
        policy.setTotalPremiumPaid(BigDecimal.ZERO);

        Policy saved = policyRepository.save(policy);
        log.info("Policy purchased: policyNumber={} customer={} plan={}",
                saved.getPolicyNumber(), email, plan.getPlanName());
        return PolicyResponse.fromEntity(saved);
    }

    public PolicyResponse issuePolicy(PolicyIssueRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.customerId()));

        PolicyPlan plan = planRepository.findById(request.planId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + request.planId()));
        if (!plan.getActive()) {
            throw new BusinessException("Plan is not active", "INACTIVE_PLAN", 400);
        }

        LocalDate endDate = request.startDate().plusYears(plan.getDurationYears());

        Policy policy = new Policy();
        policy.setPolicyNumber(generatePolicyNumber());
        policy.setCustomer(customer);
        policy.setPlan(plan);
        policy.setStartDate(request.startDate());
        policy.setEndDate(endDate);
        policy.setPolicyStatus(Policy.PolicyStatus.PENDING_PAYMENT);
        policy.setTotalPremiumPaid(BigDecimal.ZERO);

        Policy saved = policyRepository.save(policy);
        log.info("Policy issued: policyNumber={} customer={} plan={} issuedBy={}",
                saved.getPolicyNumber(), customer.getUser().getEmail(), plan.getPlanName(), currentUserEmail());
        return PolicyResponse.fromEntity(saved);
    }

    public PolicyResponse getPolicyById(Long id) {
        expirePolicies();
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id: " + id));
        if (currentUserIsCustomer() && !policy.getCustomer().getUser().getEmail().equals(currentUserEmail())) {
            throw new AccessDeniedBusinessException("You can only view your own policies");
        }
        return PolicyResponse.fromEntity(policy);
    }

    public PageResponse<PolicyResponse> getMyPolicies(int page, int size, String sortField, String sortDir) {
        String email = currentUserEmail();
        Customer customer = customerRepository.findByUser_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
        return getPoliciesByCustomer(customer.getId(), page, size, sortField, sortDir);
    }

    public PageResponse<PolicyResponse> getPoliciesByCustomer(Long customerId, int page, int size,
                                                              String sortField, String sortDir) {
        QueryValidator.validatePagination(page, size);
        Sort sort = QueryValidator.buildSort(sortField, sortDir, SORTABLE_FIELDS);
        PageRequest pageable = PageRequest.of(page - 1, size, sort);

        expirePolicies();
        Page<Policy> pageResult = policyRepository.findByCustomerId(customerId, pageable);
        return PageResponse.of(
                pageResult.getContent().stream().map(PolicyResponse::fromEntity).toList(),
                pageResult.getNumber() + 1,
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast(),
                sortField,
                QueryValidator.normalizeDirection(sortDir)
        );
    }

    public PageResponse<PolicyResponse> getAllPolicies(int page, int size, String sortField, String sortDir,
                                                       Policy.PolicyStatus status, String productType,
                                                       Long customerId) {
        QueryValidator.validatePagination(page, size);
        Sort sort = QueryValidator.buildSort(sortField, sortDir, SORTABLE_FIELDS);
        PageRequest pageable = PageRequest.of(page - 1, size, sort);

        InsuranceProduct.ProductType typeEnum = null;
        if (productType != null && !productType.isBlank()) {
            try {
                typeEnum = InsuranceProduct.ProductType.valueOf(productType.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new BusinessException(
                        "Invalid product type '" + productType + "'. Allowed values: HEALTH, MOTOR, LIFE, TRAVEL",
                        "INVALID_PRODUCT_TYPE", 400);
            }
        }

        expirePolicies();
        Page<Policy> pageResult = policyRepository.searchPolicies(customerId, status, typeEnum, pageable);
        return PageResponse.of(
                pageResult.getContent().stream().map(PolicyResponse::fromEntity).toList(),
                pageResult.getNumber() + 1,
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast(),
                sortField,
                QueryValidator.normalizeDirection(sortDir)
        );
    }

    public PolicyResponse cancelPolicy(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id: " + id));
        if (policy.getPolicyStatus() == Policy.PolicyStatus.CANCELLED) {
            throw new BusinessException("Policy is already cancelled", "ALREADY_CANCELLED", 400);
        }
        if (policy.getPolicyStatus() == Policy.PolicyStatus.EXPIRED) {
            throw new BusinessException("Cannot cancel an expired policy", "POLICY_EXPIRED", 400);
        }
        policy.setPolicyStatus(Policy.PolicyStatus.CANCELLED);
        Policy saved = policyRepository.save(policy);
        log.info("Policy cancelled: policyNumber={} by={}", saved.getPolicyNumber(), currentUserEmail());
        return PolicyResponse.fromEntity(saved);
    }

    public void activatePolicyAfterPayment(Policy policy, BigDecimal amount) {
        if (policy.getPolicyStatus() == Policy.PolicyStatus.CANCELLED
                || policy.getPolicyStatus() == Policy.PolicyStatus.EXPIRED) {
            throw new BusinessException("Cannot record payment against a cancelled or expired policy",
                    "INVALID_POLICY_STATUS", 400);
        }
        policy.setTotalPremiumPaid(policy.getTotalPremiumPaid().add(amount));
        if (policy.getTotalPremiumPaid().compareTo(policy.getPlan().getPremiumAmount()) >= 0
                && policy.getPolicyStatus() == Policy.PolicyStatus.PENDING_PAYMENT) {
            policy.setPolicyStatus(Policy.PolicyStatus.ACTIVE);
            log.info("Policy activated after successful premium payment: policyNumber={}",
                    policy.getPolicyNumber());
        }
        policyRepository.save(policy);
    }

    /**
     * Marks every non-cancelled policy whose end date has passed as EXPIRED
     * (FR-POL-010, PLC-RUL-005).
     */
    @Transactional
    public int expirePolicies() {
        LocalDate today = LocalDate.now();
        List<Policy> expired = policyRepository.findExpiredPolicies(
                today, Policy.PolicyStatus.EXPIRED, Policy.PolicyStatus.CANCELLED);
        for (Policy policy : expired) {
            policy.setPolicyStatus(Policy.PolicyStatus.EXPIRED);
        }
        if (!expired.isEmpty()) {
            policyRepository.saveAll(expired);
            log.info("Marked {} policies as expired", expired.size());
        }
        return expired.size();
    }

    private void requireCompleteProfile(Customer customer) {
        boolean complete = customer.getDateOfBirth() != null
                && hasText(customer.getAddress())
                && hasText(customer.getCity())
                && hasText(customer.getState())
                && hasText(customer.getPinCode())
                && hasText(customer.getNomineeName())
                && hasText(customer.getNomineeRelation());
        if (!complete) {
            throw new BusinessException(
                    "Please complete your customer profile before purchasing a policy",
                    "PROFILE_INCOMPLETE", 400);
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
