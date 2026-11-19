package com.insurance.insurancemgmt.plan;

import com.insurance.insurancemgmt.product.InsuranceProduct;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "policy_plans")
public class PolicyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private InsuranceProduct product;

    @NotBlank
    @Size(max = 100)
    @Column(name = "plan_name", nullable = false, length = 100)
    private String planName;

    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "coverage_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal coverageAmount;

    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "premium_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal premiumAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "premium_type", nullable = false, length = 20)
    private PremiumType premiumType;

    @Column(name = "duration_years", nullable = false)
    private Integer durationYears;

    @Size(max = 1000)
    @Column(name = "terms_and_conditions", length = 1000)
    private String termsAndConditions;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    public enum PremiumType {
        ONE_TIME, ANNUAL
    }

    public PolicyPlan() {
    }

    public PolicyPlan(Long id, InsuranceProduct product, String planName, BigDecimal coverageAmount,
                      BigDecimal premiumAmount, PremiumType premiumType, Integer durationYears,
                      String termsAndConditions, Boolean active, LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.product = product;
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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public InsuranceProduct getProduct() { return product; }
    public void setProduct(InsuranceProduct product) { this.product = product; }
    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }
    public BigDecimal getCoverageAmount() { return coverageAmount; }
    public void setCoverageAmount(BigDecimal coverageAmount) { this.coverageAmount = coverageAmount; }
    public BigDecimal getPremiumAmount() { return premiumAmount; }
    public void setPremiumAmount(BigDecimal premiumAmount) { this.premiumAmount = premiumAmount; }
    public PremiumType getPremiumType() { return premiumType; }
    public void setPremiumType(PremiumType premiumType) { this.premiumType = premiumType; }
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

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }
}
