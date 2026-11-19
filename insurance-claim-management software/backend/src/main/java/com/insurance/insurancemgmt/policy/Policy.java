package com.insurance.insurancemgmt.policy;

import com.insurance.insurancemgmt.customer.Customer;
import com.insurance.insurancemgmt.plan.PolicyPlan;
import com.insurance.insurancemgmt.payment.PremiumPayment;
import com.insurance.insurancemgmt.claim.Claim;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "policies", uniqueConstraints = @UniqueConstraint(columnNames = "policy_number"))
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "policy_number", nullable = false, unique = true, length = 50)
    private String policyNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id", nullable = false)
    private PolicyPlan plan;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "policy_status", nullable = false, length = 30)
    private PolicyStatus policyStatus;

    @DecimalMin(value = "0.0")
    @Column(name = "total_premium_paid", precision = 15, scale = 2)
    private BigDecimal totalPremiumPaid = BigDecimal.ZERO;

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PremiumPayment> payments = new ArrayList<>();

    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Claim> claims = new ArrayList<>();

    public enum PolicyStatus {
        PENDING_PAYMENT, ACTIVE, EXPIRED, CANCELLED
    }

    public Policy() {
    }

    public Policy(Long id, String policyNumber, Customer customer, PolicyPlan plan, LocalDate startDate,
                  LocalDate endDate, PolicyStatus policyStatus, BigDecimal totalPremiumPaid,
                  LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.policyNumber = policyNumber;
        this.customer = customer;
        this.plan = plan;
        this.startDate = startDate;
        this.endDate = endDate;
        this.policyStatus = policyStatus;
        this.totalPremiumPaid = totalPremiumPaid;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
    public PolicyPlan getPlan() { return plan; }
    public void setPlan(PolicyPlan plan) { this.plan = plan; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public PolicyStatus getPolicyStatus() { return policyStatus; }
    public void setPolicyStatus(PolicyStatus policyStatus) { this.policyStatus = policyStatus; }
    public BigDecimal getTotalPremiumPaid() { return totalPremiumPaid; }
    public void setTotalPremiumPaid(BigDecimal totalPremiumPaid) { this.totalPremiumPaid = totalPremiumPaid; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
    public List<PremiumPayment> getPayments() { return payments; }
    public void setPayments(List<PremiumPayment> payments) { this.payments = payments; }
    public List<Claim> getClaims() { return claims; }
    public void setClaims(List<Claim> claims) { this.claims = claims; }

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
