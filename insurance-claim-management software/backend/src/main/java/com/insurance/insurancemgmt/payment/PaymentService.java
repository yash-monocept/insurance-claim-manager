package com.insurance.insurancemgmt.payment;

import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.common.exception.AccessDeniedBusinessException;
import com.insurance.insurancemgmt.common.exception.BusinessException;
import com.insurance.insurancemgmt.common.exception.DuplicateResourceException;
import com.insurance.insurancemgmt.common.exception.ResourceNotFoundException;
import com.insurance.insurancemgmt.common.util.QueryValidator;
import com.insurance.insurancemgmt.customer.Customer;
import com.insurance.insurancemgmt.customer.CustomerRepository;
import com.insurance.insurancemgmt.policy.Policy;
import com.insurance.insurancemgmt.policy.Policy.PolicyStatus;
import com.insurance.insurancemgmt.policy.PolicyRepository;
import com.insurance.insurancemgmt.policy.PolicyService;
import com.insurance.insurancemgmt.payment.dto.PaymentRequest;
import com.insurance.insurancemgmt.payment.dto.PaymentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Service
@Transactional
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private static final Set<String> SORTABLE_FIELDS = Set.of(
            "id", "amount", "paymentDate", "paymentMode", "paymentStatus",
            "transactionReference", "createdDate");

    private final PremiumPaymentRepository paymentRepository;
    private final PolicyRepository policyRepository;
    private final CustomerRepository customerRepository;
    private final PolicyService policyService;

    public PaymentService(PremiumPaymentRepository paymentRepository,
                          PolicyRepository policyRepository,
                          CustomerRepository customerRepository,
                          PolicyService policyService) {
        this.paymentRepository = paymentRepository;
        this.policyRepository = policyRepository;
        this.customerRepository = customerRepository;
        this.policyService = policyService;
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

    public PaymentResponse recordPayment(PaymentRequest request) {
        Policy policy = policyRepository.findById(request.policyId())
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id: " + request.policyId()));

        // Customers may only pay for their own policies (FR-PAY-001)
        if (currentUserIsCustomer()
                && !policy.getCustomer().getUser().getEmail().equals(currentUserEmail())) {
            throw new AccessDeniedBusinessException("You can only record payments for your own policies");
        }

        // Cancelled policies cannot be reactivated (PLC-RUL-007)
        if (policy.getPolicyStatus() == PolicyStatus.CANCELLED) {
            throw new BusinessException("Cannot record payment against a cancelled policy",
                    "POLICY_CANCELLED", 400);
        }

        // Expired policies cannot be revived (FR-POL-010)
        if (policy.getEndDate() != null && policy.getEndDate().isBefore(LocalDate.now())) {
            if (policy.getPolicyStatus() != PolicyStatus.EXPIRED) {
                policy.setPolicyStatus(PolicyStatus.EXPIRED);
                policyRepository.save(policy);
            }
            throw new BusinessException("Cannot record payment against an expired policy",
                    "POLICY_EXPIRED", 400);
        }

        if (paymentRepository.existsByTransactionReference(request.transactionReference())) {
            throw new DuplicateResourceException(
                    "Transaction reference already exists: " + request.transactionReference());
        }

        PremiumPayment payment = new PremiumPayment();
        payment.setPolicy(policy);
        payment.setAmount(request.amount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMode(request.paymentMode());
        payment.setTransactionReference(request.transactionReference());
        payment.setPaymentStatus(request.paymentStatus());

        PremiumPayment saved = paymentRepository.save(payment);

        if (saved.getPaymentStatus() == PremiumPayment.PaymentStatus.SUCCESS) {
            policyService.activatePolicyAfterPayment(policy, saved.getAmount());
        }

        log.info("Payment recorded: policyNumber={} transactionReference={} amount={} status={} recordedBy={}",
                policy.getPolicyNumber(), saved.getTransactionReference(), saved.getAmount(),
                saved.getPaymentStatus(), currentUserEmail());
        return PaymentResponse.fromEntity(saved);
    }

    public PageResponse<PaymentResponse> getMyPayments(int page, int size, String sortField, String sortDir) {
        String email = currentUserEmail();
        Customer customer = customerRepository.findByUser_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
        return getPaymentsByCustomer(customer.getId(), page, size, sortField, sortDir);
    }

    public PageResponse<PaymentResponse> getPaymentsByCustomer(Long customerId, int page, int size,
                                                               String sortField, String sortDir) {
        QueryValidator.validatePagination(page, size);
        Sort sort = QueryValidator.buildSort(sortField, sortDir, SORTABLE_FIELDS);
        PageRequest pageable = PageRequest.of(page - 1, size, sort);

        Page<PremiumPayment> pageResult = paymentRepository.findByPolicy_CustomerId(customerId, pageable);
        return PageResponse.of(
                pageResult.getContent().stream().map(PaymentResponse::fromEntity).toList(),
                pageResult.getNumber() + 1,
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast(),
                sortField,
                QueryValidator.normalizeDirection(sortDir)
        );
    }

    public PageResponse<PaymentResponse> getAllPayments(int page, int size, String sortField, String sortDir,
                                                        Long policyId, PremiumPayment.PaymentStatus status) {
        QueryValidator.validatePagination(page, size);
        Sort sort = QueryValidator.buildSort(sortField, sortDir, SORTABLE_FIELDS);
        PageRequest pageable = PageRequest.of(page - 1, size, sort);

        Page<PremiumPayment> pageResult;
        if (policyId != null && status != null) {
            pageResult = paymentRepository.findByPolicyIdAndPaymentStatus(policyId, status, pageable);
        } else if (policyId != null) {
            pageResult = paymentRepository.findByPolicyId(policyId, pageable);
        } else if (status != null) {
            pageResult = paymentRepository.findByPaymentStatus(status, pageable);
        } else {
            pageResult = paymentRepository.findAll(pageable);
        }

        return PageResponse.of(
                pageResult.getContent().stream().map(PaymentResponse::fromEntity).toList(),
                pageResult.getNumber() + 1,
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast(),
                sortField,
                QueryValidator.normalizeDirection(sortDir)
        );
    }
}
