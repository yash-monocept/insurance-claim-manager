package com.insurance.insurancemgmt.user.dto;

import com.insurance.insurancemgmt.user.User;
import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String mobileNumber;
    private String role;
    private Boolean active;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public UserResponse() {
    }

    public UserResponse(Long id, String fullName, String email, String mobileNumber, String role,
                        Boolean active, LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.role = role;
        this.active = active;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public static UserResponse fromEntity(User user) {
        UserResponse res = new UserResponse();
        res.id = user.getId();
        res.fullName = user.getFullName();
        res.email = user.getEmail();
        res.mobileNumber = user.getMobileNumber();
        res.role = user.getRole().name();
        res.active = user.getActive();
        res.createdDate = user.getCreatedDate();
        res.updatedDate = user.getUpdatedDate();
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
}

