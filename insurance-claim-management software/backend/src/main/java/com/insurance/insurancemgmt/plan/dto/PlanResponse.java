package com.insurance.insurancemgmt.plan.dto;

import com.insurance.insurancemgmt.plan.PolicyPlan;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PlanResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productType;
    private String planName;
    private BigDecimal coverageAmount;
    private BigDecimal premiumAmount;
    private String premiumType;
    private Integer durationYears;
    private String termsAndConditions;
    private Boolean active;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public PlanResponse() {
    }

    public PlanResponse(Long id, Long productId, String productName, String productType, String planName,
                        BigDecimal coverageAmount, BigDecimal premiumAmount, String premiumType,
                        Integer durationYears, String termsAndConditions, Boolean active,
                        LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productType = productType;
        this.planName = planName;
        this.coverageAmount = coverageAmount;
        this.premiumAmount = premiumAmount;
        this.premiumType = premiumType;
        this.durationYears = durationYears;
        this.termsAndConditions = termsAndConditions;
        this.active = active;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public static PlanResponse fromEntity(PolicyPlan plan) {
        PlanResponse res = new PlanResponse();
        res.id = plan.getId();
        res.productId = plan.getProduct().getId();
        res.productName = plan.getProduct().getProductName();
        res.productType = plan.getProduct().getProductType().name();
        res.planName = plan.getPlanName();
        res.coverageAmount = plan.getCoverageAmount();
        res.premiumAmount = plan.getPremiumAmount();
        res.premiumType = plan.getPremiumType().name();
        res.durationYears = plan.getDurationYears();
        res.termsAndConditions = plan.getTermsAndConditions();
        res.active = plan.getActive();
        res.createdDate = plan.getCreatedDate();
        res.updatedDate = plan.getUpdatedDate();
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }
    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }
    public BigDecimal getCoverageAmount() { return coverageAmount; }
    public void setCoverageAmount(BigDecimal coverageAmount) { this.coverageAmount = coverageAmount; }
    public BigDecimal getPremiumAmount() { return premiumAmount; }
    public void setPremiumAmount(BigDecimal premiumAmount) { this.premiumAmount = premiumAmount; }
    public String getPremiumType() { return premiumType; }
    public void setPremiumType(String premiumType) { this.premiumType = premiumType; }
    public Integer getDurationYears() { return durationYears; }
    public void setDurationYears(Integer durationYears) { this.durationYears = durationYears; }
    public String getTermsAndConditions() { return termsAndConditions; }
    public void setTermsAndConditions(String termsAndConditions) { this.termsAndConditions = termsAndConditions; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
}

