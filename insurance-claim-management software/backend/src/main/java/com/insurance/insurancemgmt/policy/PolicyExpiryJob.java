package com.insurance.insurancemgmt.policy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Applies the policy expiry lifecycle rule (PLC-RUL / FR-POL-010): a policy
 * whose end date has passed is considered EXPIRED. The sweep runs once the
 * application is ready and then hourly.
 */
@Component
public class PolicyExpiryJob {

    private static final Logger log = LoggerFactory.getLogger(PolicyExpiryJob.class);

    private final PolicyService policyService;

    public PolicyExpiryJob(PolicyService policyService) {
        this.policyService = policyService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void sweepOnStartup() {
        sweep();
    }

    @Scheduled(initialDelay = 3_600_000L, fixedDelay = 3_600_000L)
    public void sweepHourly() {
        sweep();
    }

    private void sweep() {
        try {
            int marked = policyService.expirePolicies();
            log.debug("Policy expiry sweep completed; marked {} policies as EXPIRED", marked);
        } catch (Exception ex) {
            log.error("Policy expiry sweep failed", ex);
        }
    }
}
