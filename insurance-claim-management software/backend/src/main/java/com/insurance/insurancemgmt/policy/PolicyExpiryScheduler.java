package com.insurance.insurancemgmt.policy;

import com.insurance.insurancemgmt.common.exception.ResourceNotFoundException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Scheduled task to mark policies as EXPIRED when their end date has passed.
 * Runs once daily to keep policy statuses in sync with the SRS-defined expiry rule
 * (POL-BR-006: A policy is considered Expired when the current date is after the
 * policy end date).
 */
@Component
public class PolicyExpiryScheduler {

    private final PolicyRepository policyRepository;

    public PolicyExpiryScheduler(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    /**
     * Runs every day at 01:00 AM. Marks any ACTIVE or PENDING_PAYMENT policy whose
     * end date is before today as EXPIRED. Cancelled policies are never reactivated
     * and are left untouched.
     */
    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void expirePolicies() {
        LocalDate today = LocalDate.now();
        var expired = policyRepository.findExpiredPolicies(
                today,
                Policy.PolicyStatus.EXPIRED,
                Policy.PolicyStatus.CANCELLED);
        for (Policy policy : expired) {
            policy.setPolicyStatus(Policy.PolicyStatus.EXPIRED);
        }
        if (!expired.isEmpty()) {
            policyRepository.saveAll(expired);
        }
    }
}
