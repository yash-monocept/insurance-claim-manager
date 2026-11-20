package com.insurance.insurancemgmt.claim;

import com.insurance.insurancemgmt.claim.Claim.ClaimStatus;
import com.insurance.insurancemgmt.common.dto.PageResponse;
import com.insurance.insurancemgmt.common.exception.AccessDeniedBusinessException;
import com.insurance.insurancemgmt.common.exception.BusinessException;
import com.insurance.insurancemgmt.common.exception.ResourceNotFoundException;
import com.insurance.insurancemgmt.common.util.QueryValidator;
import com.insurance.insurancemgmt.customer.Customer;
import com.insurance.insurancemgmt.customer.CustomerRepository;
import com.insurance.insurancemgmt.history.ClaimStatusHistory;
import com.insurance.insurancemgmt.history.ClaimStatusHistoryRepository;
import com.insurance.insurancemgmt.policy.Policy;
import com.insurance.insurancemgmt.policy.Policy.PolicyStatus;
import com.insurance.insurancemgmt.policy.PolicyRepository;
import com.insurance.insurancemgmt.user.User;
import com.insurance.insurancemgmt.user.UserRepository;
import com.insurance.insurancemgmt.claim.dto.ClaimDocumentResponse;
import com.insurance.insurancemgmt.claim.dto.ClaimRequest;
import com.insurance.insurancemgmt.claim.dto.ClaimResponse;
import com.insurance.insurancemgmt.claim.dto.ClaimReviewRequest;
import com.insurance.insurancemgmt.claim.dto.ClaimRecommendationRequest;
import com.insurance.insurancemgmt.claim.dto.ClaimDecisionRequest;
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
import java.util.Set;

@Service
@Transactional
public class ClaimService {

    private static final Logger log = LoggerFactory.getLogger(ClaimService.class);

    private static final Set<String> SORTABLE_FIELDS = Set.of(
            "id", "claimNumber", "claimAmount", "incidentDate", "claimStatus",
            "createdDate", "updatedDate");

    private final ClaimRepository claimRepository;
    private final ClaimDocumentRepository claimDocumentRepository;
    private final ClaimStatusHistoryRepository historyRepository;
    private final PolicyRepository policyRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public ClaimService(ClaimRepository claimRepository,
                        ClaimDocumentRepository claimDocumentRepository,
                        ClaimStatusHistoryRepository historyRepository,
                        PolicyRepository policyRepository,
                        CustomerRepository customerRepository,
                        UserRepository userRepository) {
        this.claimRepository = claimRepository;
        this.claimDocumentRepository = claimDocumentRepository;
        this.historyRepository = historyRepository;
        this.policyRepository = policyRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    private String generateClaimNumber() {
        return "CLM-" + System.currentTimeMillis();
    }

    private String getCurrentUserEmail() {
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

    public ClaimResponse submitClaim(ClaimRequest request) {
        String email = getCurrentUserEmail();
        Customer customer = customerRepository.findByUser_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));

        Policy policy = policyRepository.findById(request.policyId())
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id: " + request.policyId()));

        // Ownership check (FR-CLM-001, SEC-AUTHZ-005)
        if (!policy.getCustomer().getId().equals(customer.getId())) {
            throw new AccessDeniedBusinessException("You can only raise claims against your own policies");
        }

        // Expired policies cannot accept new claims (PLC-RUL-005)
        if (policy.getEndDate() != null && policy.getEndDate().isBefore(LocalDate.now())) {
            if (policy.getPolicyStatus() != PolicyStatus.EXPIRED
                    && policy.getPolicyStatus() != PolicyStatus.CANCELLED) {
                policy.setPolicyStatus(PolicyStatus.EXPIRED);
                policyRepository.save(policy);
            }
            throw new BusinessException("Claims cannot be raised against an expired policy",
                    "POLICY_EXPIRED", 400);
        }

        // Policy must be active (FR-CLM-001, PLC-RUL-006)
        if (policy.getPolicyStatus() != PolicyStatus.ACTIVE) {
            throw new BusinessException("Claims can only be raised against active policies",
                    "INVALID_POLICY_STATUS", 400);
        }

        // Claim amount must not exceed coverage (FR-CLM-004)
        if (request.claimAmount().compareTo(policy.getPlan().getCoverageAmount()) > 0) {
            throw new BusinessException("Claim amount exceeds policy coverage amount",
                    "CLAIM_AMOUNT_EXCEEDS_COVERAGE", 400);
        }

        // Incident date not in future (17.7 Claim Validation)
        if (request.incidentDate().isAfter(LocalDate.now())) {
            throw new BusinessException("Incident date cannot be a future date",
                    "INVALID_INCIDENT_DATE", 400);
        }

        Claim claim = new Claim();
        claim.setClaimNumber(generateClaimNumber());
        claim.setPolicy(policy);
        claim.setClaimAmount(request.claimAmount());
        claim.setClaimReason(request.claimReason());
        claim.setIncidentDate(request.incidentDate());
        claim.setClaimStatus(ClaimStatus.SUBMITTED);

        Claim saved = claimRepository.save(claim);

        recordHistory(saved, null, ClaimStatus.SUBMITTED, "Claim submitted by customer", email);

        ClaimDocument document = new ClaimDocument();
        document.setClaim(saved);
        document.setDocumentName(request.documentName());
        document.setDocumentType(request.documentType());
        document.setDocumentReference(request.documentReference());
        claimDocumentRepository.save(document);

        log.info("Claim submitted: claimNumber={} policyNumber={} amount={} customer={}",
                saved.getClaimNumber(), policy.getPolicyNumber(), saved.getClaimAmount(), email);
        return ClaimResponse.fromEntity(saved);
    }

    public ClaimResponse getClaimById(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + id));
        if (currentUserIsCustomer()
                && !claim.getPolicy().getCustomer().getUser().getEmail().equals(getCurrentUserEmail())) {
            throw new AccessDeniedBusinessException("You can only view your own claims");
        }
        return ClaimResponse.fromEntity(claim);
    }

    public PageResponse<ClaimResponse> getMyClaims(int page, int size, String sortField, String sortDir,
                                                   ClaimStatus status) {
        String email = getCurrentUserEmail();
        Customer customer = customerRepository.findByUser_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
        return getClaimsByCustomer(customer.getId(), page, size, sortField, sortDir, status);
    }

    public PageResponse<ClaimResponse> getClaimsByCustomer(Long customerId, int page, int size,
                                                           String sortField, String sortDir, ClaimStatus status) {
        QueryValidator.validatePagination(page, size);
        Sort sort = QueryValidator.buildSort(sortField, sortDir, SORTABLE_FIELDS);
        PageRequest pageable = PageRequest.of(page - 1, size, sort);

        Page<Claim> pageResult;
        if (status != null) {
            pageResult = claimRepository.findByPolicyCustomerIdAndClaimStatus(customerId, status, pageable);
        } else {
            pageResult = claimRepository.findByPolicyCustomerId(customerId, pageable);
        }

        return PageResponse.of(
                pageResult.getContent().stream().map(ClaimResponse::fromEntity).toList(),
                pageResult.getNumber() + 1,
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast(),
                sortField,
                QueryValidator.normalizeDirection(sortDir)
        );
    }

    public PageResponse<ClaimResponse> getAllClaims(int page, int size, String sortField, String sortDir,
                                                    ClaimStatus status, Long customerId) {
        QueryValidator.validatePagination(page, size);
        Sort sort = QueryValidator.buildSort(sortField, sortDir, SORTABLE_FIELDS);
        PageRequest pageable = PageRequest.of(page - 1, size, sort);

        Page<Claim> pageResult = claimRepository.searchClaims(customerId, status, pageable);

        return PageResponse.of(
                pageResult.getContent().stream().map(ClaimResponse::fromEntity).toList(),
                pageResult.getNumber() + 1,
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast(),
                sortField,
                QueryValidator.normalizeDirection(sortDir)
        );
    }

    public ClaimResponse reviewClaim(Long id, ClaimReviewRequest request) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + id));

        if (claim.getClaimStatus() != ClaimStatus.SUBMITTED) {
            throw new BusinessException("Only submitted claims can be taken for review",
                    "INVALID_CLAIM_STATUS", 400);
        }
        if (request.recommendedStatus() != ClaimStatus.UNDER_REVIEW) {
            throw new BusinessException("Agent can only move claim to Under Review",
                    "INVALID_TRANSITION", 400);
        }

        claim.setClaimStatus(ClaimStatus.UNDER_REVIEW);
        Claim updated = claimRepository.save(claim);

        recordHistory(updated, ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW,
                request.remarks(), getCurrentUserEmail());

        log.info("Claim reviewed: claimNumber={} by={}", updated.getClaimNumber(), getCurrentUserEmail());
        return ClaimResponse.fromEntity(updated);
    }

    public ClaimResponse recommendClaim(Long id, ClaimRecommendationRequest request) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + id));

        if (claim.getClaimStatus() != ClaimStatus.UNDER_REVIEW) {
            throw new BusinessException("Only under-review claims can be recommended",
                    "INVALID_CLAIM_STATUS", 400);
        }

        ClaimStatus newStatus = request.recommendedStatus();
        if (newStatus != ClaimStatus.RECOMMENDED_FOR_APPROVAL && newStatus != ClaimStatus.RECOMMENDED_FOR_REJECTION) {
            throw new BusinessException("Agent can only recommend approval or rejection",
                    "INVALID_RECOMMENDATION", 400);
        }

        ClaimStatus previous = claim.getClaimStatus();
        claim.setClaimStatus(newStatus);
        claim.setAgentRemarks(request.remarks());
        Claim updated = claimRepository.save(claim);

        recordHistory(updated, previous, newStatus, request.remarks(), getCurrentUserEmail());

        log.info("Claim recommendation recorded: claimNumber={} recommendation={} by={}",
                updated.getClaimNumber(), newStatus, getCurrentUserEmail());
        return ClaimResponse.fromEntity(updated);
    }

    public ClaimResponse decideClaim(Long id, ClaimDecisionRequest request) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + id));

        if (claim.getClaimStatus() != ClaimStatus.RECOMMENDED_FOR_APPROVAL
                && claim.getClaimStatus() != ClaimStatus.RECOMMENDED_FOR_REJECTION) {
            throw new BusinessException("Only recommended claims can be finally decided",
                    "INVALID_CLAIM_STATUS", 400);
        }

        ClaimStatus finalStatus = request.finalStatus();
        if (finalStatus != ClaimStatus.APPROVED && finalStatus != ClaimStatus.REJECTED) {
            throw new BusinessException("Admin can only approve or reject finally",
                    "INVALID_DECISION", 400);
        }

        ClaimStatus previous = claim.getClaimStatus();
        claim.setClaimStatus(finalStatus);
        claim.setAdminRemarks(request.remarks());
        Claim updated = claimRepository.save(claim);

        recordHistory(updated, previous, finalStatus, request.remarks(), getCurrentUserEmail());

        if (finalStatus == ClaimStatus.APPROVED) {
            log.info("Claim approved finally: claimNumber={} by={}", updated.getClaimNumber(), getCurrentUserEmail());
        } else {
            log.info("Claim rejected finally: claimNumber={} by={}", updated.getClaimNumber(), getCurrentUserEmail());
        }
        return ClaimResponse.fromEntity(updated);
    }

    private void recordHistory(Claim claim, ClaimStatus previousStatus, ClaimStatus newStatus,
                               String remarks, String updatedBy) {
        ClaimStatusHistory history = new ClaimStatusHistory();
        history.setClaim(claim);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(newStatus);
        history.setRemarks(remarks);
        history.setUpdatedByUser(resolveUser(updatedBy));
        historyRepository.save(history);
    }

    private User resolveUser(String email) {
        if (email == null) {
            return null;
        }
        return userRepository.findByEmail(email).orElse(null);
    }

    public java.util.List<ClaimDocumentResponse> getClaimDocuments(Long claimId) {
        claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + claimId));
        return claimDocumentRepository.findByClaimId(claimId, org.springframework.data.domain.Pageable.unpaged())
                .getContent().stream()
                .map(ClaimDocumentResponse::fromEntity)
                .toList();
    }
}
