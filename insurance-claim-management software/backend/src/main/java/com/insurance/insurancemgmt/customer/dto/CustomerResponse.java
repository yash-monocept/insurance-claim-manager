package com.insurance.insurancemgmt.customer.dto;

import com.insurance.insurancemgmt.customer.Customer;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CustomerResponse {

    private Long id;
    private String fullName;
    private String email;
    private String mobileNumber;
    private LocalDate dateOfBirth;
    private String address;
    private String city;
    private String state;
    private String pinCode;
    private String nomineeName;
    private String nomineeRelation;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public CustomerResponse() {
    }

    public CustomerResponse(Long id, String fullName, String email, String mobileNumber, LocalDate dateOfBirth,
                            String address, String city, String state, String pinCode, String nomineeName,
                            String nomineeRelation, LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.city = city;
        this.state = state;
        this.pinCode = pinCode;
        this.nomineeName = nomineeName;
        this.nomineeRelation = nomineeRelation;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public static CustomerResponse fromEntity(Customer customer) {
        CustomerResponse res = new CustomerResponse();
        res.id = customer.getId();
        res.fullName = customer.getUser().getFullName();
        res.email = customer.getUser().getEmail();
        res.mobileNumber = customer.getUser().getMobileNumber();
        res.dateOfBirth = customer.getDateOfBirth();
        res.address = customer.getAddress();
        res.city = customer.getCity();
        res.state = customer.getState();
        res.pinCode = customer.getPinCode();
        res.nomineeName = customer.getNomineeName();
        res.nomineeRelation = customer.getNomineeRelation();
        res.createdDate = customer.getCreatedDate();
        res.updatedDate = customer.getUpdatedDate();
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
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }
    public String getNomineeName() { return nomineeName; }
    public void setNomineeName(String nomineeName) { this.nomineeName = nomineeName; }
    public String getNomineeRelation() { return nomineeRelation; }
    public void setNomineeRelation(String nomineeRelation) { this.nomineeRelation = nomineeRelation; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
}

