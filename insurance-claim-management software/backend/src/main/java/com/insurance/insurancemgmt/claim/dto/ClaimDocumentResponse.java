package com.insurance.insurancemgmt.claim.dto;

import com.insurance.insurancemgmt.claim.ClaimDocument;
import java.time.LocalDateTime;

public class ClaimDocumentResponse {

    private Long id;
    private String documentName;
    private String documentType;
    private String documentReference;
    private LocalDateTime uploadedDate;

    public ClaimDocumentResponse() {
    }

    public ClaimDocumentResponse(Long id, String documentName, String documentType,
                                 String documentReference, LocalDateTime uploadedDate) {
        this.id = id;
        this.documentName = documentName;
        this.documentType = documentType;
        this.documentReference = documentReference;
        this.uploadedDate = uploadedDate;
    }

    public static ClaimDocumentResponse fromEntity(ClaimDocument doc) {
        return new ClaimDocumentResponse(
            doc.getId(),
            doc.getDocumentName(),
            doc.getDocumentType(),
            doc.getDocumentReference(),
            doc.getUploadedDate()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }
    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }
    public String getDocumentReference() { return documentReference; }
    public void setDocumentReference(String documentReference) { this.documentReference = documentReference; }
    public LocalDateTime getUploadedDate() { return uploadedDate; }
    public void setUploadedDate(LocalDateTime uploadedDate) { this.uploadedDate = uploadedDate; }
}
