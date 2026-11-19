package com.insurance.insurancemgmt.history;

import com.insurance.insurancemgmt.claim.Claim;
import com.insurance.insurancemgmt.claim.Claim.ClaimStatus;
import com.insurance.insurancemgmt.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "claim_status_history")
public class ClaimStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "claim_id", nullable = false)
    private Claim claim;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", length = 40)
    private ClaimStatus previousStatus;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 40)
    private ClaimStatus newStatus;

    @Size(max = 1000)
    @Column(name = "remarks", length = 1000)
    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by_user_id")
    private User updatedByUser;

    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

    public ClaimStatusHistory() {
    }

    public ClaimStatusHistory(Long id, Claim claim, ClaimStatus previousStatus, ClaimStatus newStatus,
                              String remarks, User updatedByUser, LocalDateTime updatedDate) {
        this.id = id;
        this.claim = claim;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.remarks = remarks;
        this.updatedByUser = updatedByUser;
        this.updatedDate = updatedDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Claim getClaim() { return claim; }
    public void setClaim(Claim claim) { this.claim = claim; }
    public ClaimStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(ClaimStatus previousStatus) { this.previousStatus = previousStatus; }
    public ClaimStatus getNewStatus() { return newStatus; }
    public void setNewStatus(ClaimStatus newStatus) { this.newStatus = newStatus; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getUpdatedByEmail() { return updatedByUser == null ? null : updatedByUser.getEmail(); }
    public User getUpdatedByUser() { return updatedByUser; }
    public void setUpdatedByUser(User updatedByUser) { this.updatedByUser = updatedByUser; }
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }

    @PrePersist
    protected void onCreate() {
        updatedDate = LocalDateTime.now();
    }
}
