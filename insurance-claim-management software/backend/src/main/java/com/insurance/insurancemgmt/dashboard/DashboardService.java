package com.insurance.insurancemgmt.dashboard;

import com.insurance.insurancemgmt.claim.Claim.ClaimStatus;
import com.insurance.insurancemgmt.claim.ClaimRepository;
import com.insurance.insurancemgmt.customer.CustomerRepository;
import com.insurance.insurancemgmt.payment.PremiumPayment.PaymentStatus;
import com.insurance.insurancemgmt.payment.PremiumPaymentRepository;
import com.insurance.insurancemgmt.policy.Policy.PolicyStatus;
import com.insurance.insurancemgmt.policy.PolicyRepository;
import com.insurance.insurancemgmt.product.InsuranceProduct.ProductType;
import com.insurance.insurancemgmt.product.InsuranceProductRepository;
import com.insurance.insurancemgmt.user.User.Role;
import com.insurance.insurancemgmt.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final PremiumPaymentRepository paymentRepository;
    private final InsuranceProductRepository productRepository;

    public DashboardService(UserRepository userRepository,
                            CustomerRepository customerRepository,
                            PolicyRepository policyRepository,
                            ClaimRepository claimRepository,
                            PremiumPaymentRepository paymentRepository,
                            InsuranceProductRepository productRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.policyRepository = policyRepository;
        this.claimRepository = claimRepository;
        this.paymentRepository = paymentRepository;
        this.productRepository = productRepository;
    }

    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalUsers", userRepository.count());
        data.put("totalCustomers", userRepository.countByRole(Role.CUSTOMER));
        data.put("totalAgents", userRepository.countByRole(Role.AGENT));
        data.put("totalPolicies", policyRepository.count());
        data.put("activePolicies", policyRepository.countByPolicyStatus(PolicyStatus.ACTIVE));
        data.put("pendingPaymentPolicies", policyRepository.countByPolicyStatus(PolicyStatus.PENDING_PAYMENT));
        data.put("expiredPolicies", policyRepository.countByPolicyStatus(PolicyStatus.EXPIRED));
        data.put("cancelledPolicies", policyRepository.countByPolicyStatus(PolicyStatus.CANCELLED));
        data.put("totalClaims", claimRepository.count());
        data.put("claimsSubmitted", claimRepository.countByStatus(ClaimStatus.SUBMITTED));
        data.put("claimsUnderReview", claimRepository.countByStatus(ClaimStatus.UNDER_REVIEW));
        data.put("claimsApproved", claimRepository.countByStatus(ClaimStatus.APPROVED));
        data.put("claimsRejected", claimRepository.countByStatus(ClaimStatus.REJECTED));

        // Payment summary
        BigDecimal totalSuccessful = paymentRepository.sumAllByPaymentStatus(PaymentStatus.SUCCESS);
        data.put("totalSuccessfulPayments", totalSuccessful != null ? totalSuccessful : BigDecimal.ZERO);

        // Upcoming expiries (next 30 days)
        LocalDate today = LocalDate.now();
        LocalDate thirtyDays = today.plusDays(30);
        long upcomingExpiries = policyRepository.countByEndDateBetweenAndPolicyStatusNot(
                today, thirtyDays, PolicyStatus.EXPIRED, PolicyStatus.CANCELLED);
        data.put("upcomingExpiries", upcomingExpiries);

        return data;
    }

    public Map<String, Object> getAgentDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalClaimsSubmitted", claimRepository.countByStatus(ClaimStatus.SUBMITTED));
        data.put("totalClaimsUnderReview", claimRepository.countByStatus(ClaimStatus.UNDER_REVIEW));
        data.put("totalClaimsRecommended", claimRepository.countByStatus(ClaimStatus.RECOMMENDED_FOR_APPROVAL)
                + claimRepository.countByStatus(ClaimStatus.RECOMMENDED_FOR_REJECTION));
        data.put("totalPolicies", policyRepository.count());
        data.put("activePolicies", policyRepository.countByPolicyStatus(PolicyStatus.ACTIVE));
        data.put("pendingPaymentPolicies", policyRepository.countByPolicyStatus(PolicyStatus.PENDING_PAYMENT));
        data.put("totalCustomers", userRepository.countByRole(Role.CUSTOMER));
        return data;
    }

    public Map<String, Object> getCustomerDashboard(String email) {
        com.insurance.insurancemgmt.customer.Customer customer = customerRepository.findByUser_Email(email)
                .orElseThrow(() -> new com.insurance.insurancemgmt.common.exception.ResourceNotFoundException("Customer profile not found"));
        Long customerId = customer.getId();
        Map<String, Object> data = new HashMap<>();
        data.put("totalPolicies", policyRepository.countByCustomerId(customerId));
        data.put("activePolicies", policyRepository.countByCustomerIdAndPolicyStatus(customerId, PolicyStatus.ACTIVE));
        data.put("pendingPaymentPolicies", policyRepository.countByCustomerIdAndPolicyStatus(customerId, PolicyStatus.PENDING_PAYMENT));
        data.put("expiredPolicies", policyRepository.countByCustomerIdAndPolicyStatus(customerId, PolicyStatus.EXPIRED));
        data.put("cancelledPolicies", policyRepository.countByCustomerIdAndPolicyStatus(customerId, PolicyStatus.CANCELLED));
        data.put("totalClaims", claimRepository.countByPolicyCustomerId(customerId));
        data.put("claimsUnderReview", claimRepository.countByPolicyCustomerIdAndClaimStatus(customerId, ClaimStatus.UNDER_REVIEW));
        return data;
    }

    public Map<String, Object> getAnalytics() {
        Map<String, Object> data = new HashMap<>();

        // Policies by status
        Map<String, Long> policiesByStatus = new HashMap<>();
        policiesByStatus.put("PENDING_PAYMENT", policyRepository.countByPolicyStatus(PolicyStatus.PENDING_PAYMENT));
        policiesByStatus.put("ACTIVE", policyRepository.countByPolicyStatus(PolicyStatus.ACTIVE));
        policiesByStatus.put("EXPIRED", policyRepository.countByPolicyStatus(PolicyStatus.EXPIRED));
        policiesByStatus.put("CANCELLED", policyRepository.countByPolicyStatus(PolicyStatus.CANCELLED));
        data.put("policiesByStatus", policiesByStatus);

        // Claims by status
        Map<String, Long> claimsByStatus = new HashMap<>();
        claimsByStatus.put("SUBMITTED", claimRepository.countByStatus(ClaimStatus.SUBMITTED));
        claimsByStatus.put("UNDER_REVIEW", claimRepository.countByStatus(ClaimStatus.UNDER_REVIEW));
        claimsByStatus.put("RECOMMENDED_FOR_APPROVAL", claimRepository.countByStatus(ClaimStatus.RECOMMENDED_FOR_APPROVAL));
        claimsByStatus.put("RECOMMENDED_FOR_REJECTION", claimRepository.countByStatus(ClaimStatus.RECOMMENDED_FOR_REJECTION));
        claimsByStatus.put("APPROVED", claimRepository.countByStatus(ClaimStatus.APPROVED));
        claimsByStatus.put("REJECTED", claimRepository.countByStatus(ClaimStatus.REJECTED));
        data.put("claimsByStatus", claimsByStatus);

        // Products
        List<Object[]> productStats = productRepository.countPoliciesByProduct();
        data.put("policiesByProduct", productStats);

        // Monthly trend (last 6 months)
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        List<Object[]> monthlyTrend = policyRepository.countPoliciesByMonth(sixMonthsAgo.atStartOfDay());
        data.put("monthlyPolicyCreation", monthlyTrend);

        // Headline totals
        data.put("totalPolicies", policyRepository.count());
        data.put("totalClaims", claimRepository.count());
        data.put("totalCustomers", userRepository.countByRole(Role.CUSTOMER));
        BigDecimal totalSuccessful = paymentRepository.sumAllByPaymentStatus(PaymentStatus.SUCCESS);
        data.put("totalSuccessfulPayments", totalSuccessful != null ? totalSuccessful : BigDecimal.ZERO);

        return data;
    }
}
