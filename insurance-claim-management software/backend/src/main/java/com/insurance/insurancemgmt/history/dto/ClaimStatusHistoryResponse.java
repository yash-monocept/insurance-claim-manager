package com.insurance.insurancemgmt.history.dto;

import com.insurance.insurancemgmt.claim.Claim.ClaimStatus;
import com.insurance.insurancemgmt.history.ClaimStatusHistory;
import java.time.LocalDateTime;

public class ClaimStatusHistoryResponse {

    private Long id;
    private ClaimStatus previousStatus;
    private ClaimStatus newStatus;
    private String remarks;
    private String updatedBy;
    private LocalDateTime updatedDate;

    public ClaimStatusHistoryResponse() {
    }

    public ClaimStatusHistoryResponse(Long id, ClaimStatus previousStatus, ClaimStatus newStatus,
                                      String remarks, String updatedBy, LocalDateTime updatedDate) {
        this.id = id;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.remarks = remarks;
        this.updatedBy = updatedBy;
        this.updatedDate = updatedDate;
    }

    public static ClaimStatusHistoryResponse fromEntity(ClaimStatusHistory history) {
        ClaimStatusHistoryResponse res = new ClaimStatusHistoryResponse();
        res.id = history.getId();
        res.previousStatus = history.getPreviousStatus();
        res.newStatus = history.getNewStatus();
        res.remarks = history.getRemarks();
        res.updatedBy = history.getUpdatedByEmail();
        res.updatedDate = history.getUpdatedDate();
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ClaimStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(ClaimStatus previousStatus) { this.previousStatus = previousStatus; }
    public ClaimStatus getNewStatus() { return newStatus; }
    public void setNewStatus(ClaimStatus newStatus) { this.newStatus = newStatus; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
}

