package com.insurance.insurancemgmt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Entry point of the Insurance Policy and Claim Management System.
 *
 * <p>Modular monolithic Spring Boot application.</p>
 */
@SpringBootApplication(scanBasePackages = "com.insurance.insurancemgmt")
@EnableScheduling
public class InsuranceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InsuranceApplication.class, args);
    }
}
