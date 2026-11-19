package com.insurance.insurancemgmt.claim;

import com.insurance.insurancemgmt.policy.Policy;
import com.insurance.insurancemgmt.history.ClaimStatusHistory;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "claims", uniqueConstraints = @UniqueConstraint(columnNames = "claim_number"))
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(name = "claim_number", nullable = false, unique = true, length = 50)
    private String claimNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "claim_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal claimAmount;

    @NotBlank
    @Size(max = 1000)
    @Column(name = "claim_reason", nullable = false, length = 1000)
    private String claimReason;

    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "claim_status", nullable = false, length = 40)
    private ClaimStatus claimStatus;

    @Size(max = 1000)
    @Column(name = "agent_remarks", length = 1000)
    private String agentRemarks;

    @Size(max = 1000)
    @Column(name = "admin_remarks", length = 1000)
    private String adminRemarks;

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @OneToMany(mappedBy = "claim", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClaimDocument> documents = new ArrayList<>();

    @OneToMany(mappedBy = "claim", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClaimStatusHistory> statusHistories = new ArrayList<>();

    public enum ClaimStatus {
        SUBMITTED, UNDER_REVIEW, RECOMMENDED_FOR_APPROVAL, RECOMMENDED_FOR_REJECTION, APPROVED, REJECTED
    }

    public Claim() {
    }

    public Claim(Long id, String claimNumber, Policy policy, BigDecimal claimAmount, String claimReason,
                 LocalDate incidentDate, ClaimStatus claimStatus, String agentRemarks, String adminRemarks,
                 LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.claimNumber = claimNumber;
        this.policy = policy;
        this.claimAmount = claimAmount;
        this.claimReason = claimReason;
        this.incidentDate = incidentDate;
        this.claimStatus = claimStatus;
        this.agentRemarks = agentRemarks;
        this.adminRemarks = adminRemarks;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getClaimNumber() { return claimNumber; }
    public void setClaimNumber(String claimNumber) { this.claimNumber = claimNumber; }
    public Policy getPolicy() { return policy; }
    public void setPolicy(Policy policy) { this.policy = policy; }
    public BigDecimal getClaimAmount() { return claimAmount; }
    public void setClaimAmount(BigDecimal claimAmount) { this.claimAmount = claimAmount; }
    public String getClaimReason() { return claimReason; }
    public void setClaimReason(String claimReason) { this.claimReason = claimReason; }
    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }
    public ClaimStatus getClaimStatus() { return claimStatus; }
    public void setClaimStatus(ClaimStatus claimStatus) { this.claimStatus = claimStatus; }
    public String getAgentRemarks() { return agentRemarks; }
    public void setAgentRemarks(String agentRemarks) { this.agentRemarks = agentRemarks; }
    public String getAdminRemarks() { return adminRemarks; }
    public void setAdminRemarks(String adminRemarks) { this.adminRemarks = adminRemarks; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
    public List<ClaimDocument> getDocuments() { return documents; }
    public void setDocuments(List<ClaimDocument> documents) { this.documents = documents; }
    public List<ClaimStatusHistory> getStatusHistories() { return statusHistories; }
    public void setStatusHistories(List<ClaimStatusHistory> statusHistories) { this.statusHistories = statusHistories; }

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
