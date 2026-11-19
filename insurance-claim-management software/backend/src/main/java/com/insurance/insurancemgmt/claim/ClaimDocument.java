package com.insurance.insurancemgmt.claim;

import com.insurance.insurancemgmt.claim.Claim;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "claim_documents")
public class ClaimDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "claim_id", nullable = false)
    private Claim claim;

    @NotBlank
    @Size(max = 200)
    @Column(name = "document_name", nullable = false, length = 200)
    private String documentName;

    @Size(max = 100)
    @Column(name = "document_type", length = 100)
    private String documentType;

    @Size(max = 500)
    @Column(name = "document_reference", length = 500)
    private String documentReference;

    @Column(name = "uploaded_date", nullable = false)
    private LocalDateTime uploadedDate;

    public ClaimDocument() {
    }

    public ClaimDocument(Long id, Claim claim, String documentName, String documentType,
                         String documentReference, LocalDateTime uploadedDate) {
        this.id = id;
        this.claim = claim;
        this.documentName = documentName;
        this.documentType = documentType;
        this.documentReference = documentReference;
        this.uploadedDate = uploadedDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Claim getClaim() { return claim; }
    public void setClaim(Claim claim) { this.claim = claim; }
    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }
    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }
    public String getDocumentReference() { return documentReference; }
    public void setDocumentReference(String documentReference) { this.documentReference = documentReference; }
    public LocalDateTime getUploadedDate() { return uploadedDate; }
    public void setUploadedDate(LocalDateTime uploadedDate) { this.uploadedDate = uploadedDate; }

    @PrePersist
    protected void onCreate() {
        uploadedDate = LocalDateTime.now();
    }
}
