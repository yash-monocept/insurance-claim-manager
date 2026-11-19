package com.insurance.insurancemgmt.policy.dto;

import com.insurance.insurancemgmt.policy.Policy;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PolicyResponse {

    private Long id;
    private String policyNumber;
    private String customerName;
    private String customerEmail;
    private String planName;
    private String productType;
    private BigDecimal coverageAmount;
    private BigDecimal premiumAmount;
    private String premiumType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String policyStatus;
    private BigDecimal totalPremiumPaid;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public PolicyResponse() {
    }

    public PolicyResponse(Long id, String policyNumber, String customerName, String customerEmail,
                          String planName, String productType, BigDecimal coverageAmount, BigDecimal premiumAmount,
                          String premiumType, LocalDate startDate, LocalDate endDate, String policyStatus,
                          BigDecimal totalPremiumPaid, LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.policyNumber = policyNumber;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.planName = planName;
        this.productType = productType;
        this.coverageAmount = coverageAmount;
        this.premiumAmount = premiumAmount;
        this.premiumType = premiumType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.policyStatus = policyStatus;
        this.totalPremiumPaid = totalPremiumPaid;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public static PolicyResponse fromEntity(Policy policy) {
        PolicyResponse res = new PolicyResponse();
        res.id = policy.getId();
        res.policyNumber = policy.getPolicyNumber();
        res.customerName = policy.getCustomer().getUser().getFullName();
        res.customerEmail = policy.getCustomer().getUser().getEmail();
        res.planName = policy.getPlan().getPlanName();
        res.productType = policy.getPlan().getProduct().getProductType().name();
        res.coverageAmount = policy.getPlan().getCoverageAmount();
        res.premiumAmount = policy.getPlan().getPremiumAmount();
        res.premiumType = policy.getPlan().getPremiumType().name();
        res.startDate = policy.getStartDate();
        res.endDate = policy.getEndDate();
        res.policyStatus = effectiveStatus(policy);
        res.totalPremiumPaid = policy.getTotalPremiumPaid();
        res.createdDate = policy.getCreatedDate();
        res.updatedDate = policy.getUpdatedDate();
        return res;
    }

    /**
     * A policy is considered EXPIRED once the current date is after its end date,
     * unless it was explicitly cancelled (FR-POL-010).
     */
    private static String effectiveStatus(Policy policy) {
        if (policy.getPolicyStatus() != Policy.PolicyStatus.CANCELLED
                && policy.getEndDate() != null
                && policy.getEndDate().isBefore(java.time.LocalDate.now())) {
            return Policy.PolicyStatus.EXPIRED.name();
        }
        return policy.getPolicyStatus() == null ? null : policy.getPolicyStatus().name();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }
    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }
    public BigDecimal getCoverageAmount() { return coverageAmount; }
    public void setCoverageAmount(BigDecimal coverageAmount) { this.coverageAmount = coverageAmount; }
    public BigDecimal getPremiumAmount() { return premiumAmount; }
    public void setPremiumAmount(BigDecimal premiumAmount) { this.premiumAmount = premiumAmount; }
    public String getPremiumType() { return premiumType; }
    public void setPremiumType(String premiumType) { this.premiumType = premiumType; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getPolicyStatus() { return policyStatus; }
    public void setPolicyStatus(String policyStatus) { this.policyStatus = policyStatus; }
    public BigDecimal getTotalPremiumPaid() { return totalPremiumPaid; }
    public void setTotalPremiumPaid(BigDecimal totalPremiumPaid) { this.totalPremiumPaid = totalPremiumPaid; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
}

