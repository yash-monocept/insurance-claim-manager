package com.insurance.insurancemgmt.payment.dto;

import com.insurance.insurancemgmt.payment.PremiumPayment;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {

    private Long id;
    private String policyNumber;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private String paymentMode;
    private String transactionReference;
    private String paymentStatus;

    public PaymentResponse() {
    }

    public PaymentResponse(Long id, String policyNumber, BigDecimal amount, LocalDateTime paymentDate,
                           String paymentMode, String transactionReference, String paymentStatus) {
        this.id = id;
        this.policyNumber = policyNumber;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMode = paymentMode;
        this.transactionReference = transactionReference;
        this.paymentStatus = paymentStatus;
    }

    public static PaymentResponse fromEntity(PremiumPayment payment) {
        PaymentResponse res = new PaymentResponse();
        res.id = payment.getId();
        res.policyNumber = payment.getPolicy().getPolicyNumber();
        res.amount = payment.getAmount();
        res.paymentDate = payment.getPaymentDate();
        res.paymentMode = payment.getPaymentMode().name();
        res.transactionReference = payment.getTransactionReference();
        res.paymentStatus = payment.getPaymentStatus().name();
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }
    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}

