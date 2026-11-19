package com.insurance.insurancemgmt.claim.dto;

import com.insurance.insurancemgmt.claim.Claim;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ClaimResponse {

    private Long id;
    private String claimNumber;
    private String policyNumber;
    private String customerName;
    private BigDecimal claimAmount;
    private String claimReason;
    private LocalDate incidentDate;
    private String claimStatus;
    private String agentRemarks;
    private String adminRemarks;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public ClaimResponse() {
    }

    public ClaimResponse(Long id, String claimNumber, String policyNumber, String customerName,
                         BigDecimal claimAmount, String claimReason, LocalDate incidentDate,
                         String claimStatus, String agentRemarks, String adminRemarks,
                         LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.claimNumber = claimNumber;
        this.policyNumber = policyNumber;
        this.customerName = customerName;
        this.claimAmount = claimAmount;
        this.claimReason = claimReason;
        this.incidentDate = incidentDate;
        this.claimStatus = claimStatus;
        this.agentRemarks = agentRemarks;
        this.adminRemarks = adminRemarks;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public static ClaimResponse fromEntity(Claim claim) {
        ClaimResponse res = new ClaimResponse();
        res.id = claim.getId();
        res.claimNumber = claim.getClaimNumber();
        res.policyNumber = claim.getPolicy().getPolicyNumber();
        res.customerName = claim.getPolicy().getCustomer().getUser().getFullName();
        res.claimAmount = claim.getClaimAmount();
        res.claimReason = claim.getClaimReason();
        res.incidentDate = claim.getIncidentDate();
        res.claimStatus = claim.getClaimStatus().name();
        res.agentRemarks = claim.getAgentRemarks();
        res.adminRemarks = claim.getAdminRemarks();
        res.createdDate = claim.getCreatedDate();
        res.updatedDate = claim.getUpdatedDate();
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getClaimNumber() { return claimNumber; }
    public void setClaimNumber(String claimNumber) { this.claimNumber = claimNumber; }
    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public BigDecimal getClaimAmount() { return claimAmount; }
    public void setClaimAmount(BigDecimal claimAmount) { this.claimAmount = claimAmount; }
    public String getClaimReason() { return claimReason; }
    public void setClaimReason(String claimReason) { this.claimReason = claimReason; }
    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }
    public String getClaimStatus() { return claimStatus; }
    public void setClaimStatus(String claimStatus) { this.claimStatus = claimStatus; }
    public String getAgentRemarks() { return agentRemarks; }
    public void setAgentRemarks(String agentRemarks) { this.agentRemarks = agentRemarks; }
    public String getAdminRemarks() { return adminRemarks; }
    public void setAdminRemarks(String adminRemarks) { this.adminRemarks = adminRemarks; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
}

