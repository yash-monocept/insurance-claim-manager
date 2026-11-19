package com.insurance.insurancemgmt.payment;

import com.insurance.insurancemgmt.policy.Policy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PremiumPaymentRepository extends JpaRepository<PremiumPayment, Long> {

    Optional<PremiumPayment> findByTransactionReference(String transactionReference);

    boolean existsByTransactionReference(String transactionReference);

    Page<PremiumPayment> findByPolicyId(Long policyId, Pageable pageable);

    Page<PremiumPayment> findByPolicy_CustomerId(Long customerId, Pageable pageable);

    Page<PremiumPayment> findByPolicyIdAndPaymentStatus(Long policyId, PremiumPayment.PaymentStatus status, Pageable pageable);

    Page<PremiumPayment> findByPaymentStatus(PremiumPayment.PaymentStatus status, Pageable pageable);

    @Query("SELECT p FROM PremiumPayment p " +
           "WHERE (:policyId IS NULL OR p.policy.id = :policyId) " +
           "AND (:status IS NULL OR p.paymentStatus = :status)")
    Page<PremiumPayment> searchPayments(@Param("policyId") Long policyId,
                                        @Param("status") PremiumPayment.PaymentStatus status,
                                        Pageable pageable);

    @Query("SELECT SUM(p.amount) FROM PremiumPayment p WHERE p.policy.id = :policyId AND p.paymentStatus = :status")
    BigDecimal sumByPolicyIdAndStatus(@Param("policyId") Long policyId,
                                      @Param("status") PremiumPayment.PaymentStatus status);

    @Query("SELECT SUM(p.amount) FROM PremiumPayment p WHERE p.paymentStatus = :status")
    BigDecimal sumAllByPaymentStatus(@Param("status") PremiumPayment.PaymentStatus status);
}
