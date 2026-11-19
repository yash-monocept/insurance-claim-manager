package com.insurance.insurancemgmt.product.dto;

import com.insurance.insurancemgmt.product.InsuranceProduct;
import java.time.LocalDateTime;

public class ProductResponse {

    private Long id;
    private String productName;
    private String productType;
    private String description;
    private Boolean active;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public ProductResponse() {
    }

    public ProductResponse(Long id, String productName, String productType, String description,
                           Boolean active, LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.productName = productName;
        this.productType = productType;
        this.description = description;
        this.active = active;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public static ProductResponse fromEntity(InsuranceProduct product) {
        ProductResponse res = new ProductResponse();
        res.id = product.getId();
        res.productName = product.getProductName();
        res.productType = product.getProductType().name();
        res.description = product.getDescription();
        res.active = product.getActive();
        res.createdDate = product.getCreatedDate();
        res.updatedDate = product.getUpdatedDate();
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
}

