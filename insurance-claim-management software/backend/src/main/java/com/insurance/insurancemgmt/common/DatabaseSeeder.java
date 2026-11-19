package com.insurance.insurancemgmt.common;

import com.insurance.insurancemgmt.customer.Customer;
import com.insurance.insurancemgmt.customer.CustomerRepository;
import com.insurance.insurancemgmt.customer.dto.CustomerRequest;
import com.insurance.insurancemgmt.customer.CustomerService;
import com.insurance.insurancemgmt.plan.PolicyPlan;
import com.insurance.insurancemgmt.plan.PolicyPlanRepository;
import com.insurance.insurancemgmt.plan.PlanService;
import com.insurance.insurancemgmt.plan.dto.PlanRequest;
import com.insurance.insurancemgmt.product.InsuranceProduct;
import com.insurance.insurancemgmt.product.InsuranceProductRepository;
import com.insurance.insurancemgmt.product.ProductService;
import com.insurance.insurancemgmt.product.dto.ProductRequest;
import com.insurance.insurancemgmt.user.User;
import com.insurance.insurancemgmt.user.UserRepository;
import com.insurance.insurancemgmt.user.UserService;
import com.insurance.insurancemgmt.user.dto.AgentCreationRequest;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner init(UserRepository userRepository,
                           UserService userService,
                           CustomerService customerService,
                           ProductService productService,
                           PlanService planService,
                           CustomerRepository customerRepository,
                           InsuranceProductRepository productRepository,
                           PolicyPlanRepository planRepository,
                           PasswordEncoder passwordEncoder,
                           JdbcTemplate jdbcTemplate) {
        return args -> {
            seedUsers(userRepository, userService, customerService, passwordEncoder);
            backfillCustomerProfiles(userRepository, customerRepository);
            backfillClaimHistoryUsers(jdbcTemplate);
            seedProducts(productService, productRepository);
            seedPlans(planService, productRepository, planRepository);
        };
    }

    /**
     * Older history rows stored the actor as an email string in updated_by.
     * MAP-009 models this as a User relation, so lift the old values into
     * updated_by_user_id once at startup. Harmless on a fresh schema.
     */
    private void backfillClaimHistoryUsers(JdbcTemplate jdbcTemplate) {
        try {
            int updated = jdbcTemplate.update(
                    "UPDATE claim_status_history h JOIN users u ON u.email = h.updated_by " +
                    "SET h.updated_by_user_id = u.id " +
                    "WHERE h.updated_by_user_id IS NULL AND h.updated_by IS NOT NULL");
            if (updated > 0) {
                System.out.println("Backfilled " + updated + " claim history user references.");
            }
        } catch (Exception ex) {
            System.out.println("Claim history user backfill skipped: " + ex.getMessage());
        }
    }

    /**
     * Older self-registrations (and any data created outside the seeder) can
     * leave a CUSTOMER user without a customers row. Without it every
     * /api/*&#47;me endpoint returns 404 for that user.
     */
    private void backfillCustomerProfiles(UserRepository userRepository,
                                          CustomerRepository customerRepository) {
        for (User user : userRepository.findByRole(User.Role.CUSTOMER)) {
            if (!customerRepository.existsByUserId(user.getId())) {
                Customer customer = new Customer();
                customer.setUser(user);
                customerRepository.save(customer);
                System.out.println("Backfilled missing customer profile for " + user.getEmail());
            }
        }
    }

    private void seedUsers(UserRepository userRepository,
                           UserService userService,
                           CustomerService customerService,
                           PasswordEncoder passwordEncoder) {
        if (userRepository.count() > 0) {
            return; // already seeded
        }

        // ---- Create Admin ----
        User admin = new User();
        admin.setFullName("System Administrator");
        admin.setEmail("admin@insurance.com");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setMobileNumber("+1-555-0001");
        admin.setRole(User.Role.ADMIN);
        admin.setActive(true);
        userRepository.save(admin);

        // ---- Create Agents ----
        AgentCreationRequest agent1Req = new AgentCreationRequest(
                "John Agent", "agent1@insurance.com", "Agent@123", "+1-555-0002");
        userService.createAgent(agent1Req);

        AgentCreationRequest agent2Req = new AgentCreationRequest(
                "Sarah Agent", "agent2@insurance.com", "Agent@123", "+1-555-0003");
        userService.createAgent(agent2Req);

        // ---- Create Customers ----
        User c1 = new User();
        c1.setFullName("Alice Customer");
        c1.setEmail("customer1@example.com");
        c1.setPassword(passwordEncoder.encode("Cust@123"));
        c1.setMobileNumber("+1-555-0101");
        c1.setRole(User.Role.CUSTOMER);
        c1.setActive(true);
        userRepository.save(c1);

        CustomerRequest c1Profile = new CustomerRequest(
                LocalDate.of(1985, 5, 15), "123 Maple Street", "New York", "NY", "10001",
                "Bob Customer", "Spouse");
        customerService.createProfileForUser(c1, c1Profile);

        User c2 = new User();
        c2.setFullName("Bob Customer");
        c2.setEmail("customer2@example.com");
        c2.setPassword(passwordEncoder.encode("Cust@123"));
        c2.setMobileNumber("+1-555-0102");
        c2.setRole(User.Role.CUSTOMER);
        c2.setActive(true);
        userRepository.save(c2);

        CustomerRequest c2Profile = new CustomerRequest(
                LocalDate.of(1990, 8, 22), "456 Oak Avenue", "Los Angeles", "CA", "90001",
                "Carol Customer", "Spouse");
        customerService.createProfileForUser(c2, c2Profile);

        System.out.println("Demo users seeded successfully.");
        System.out.println("  Admin: admin@insurance.com / Admin@123");
        System.out.println("  Agent 1: agent1@insurance.com / Agent@123");
        System.out.println("  Agent 2: agent2@insurance.com / Agent@123");
        System.out.println("  Customer 1: customer1@example.com / Cust@123");
        System.out.println("  Customer 2: customer2@example.com / Cust@123");
    }

    private void seedProducts(ProductService productService,
                              InsuranceProductRepository productRepository) {
        if (productRepository.count() > 0) {
            return;
        }

        productService.createProduct(new ProductRequest(
                "Health Insurance", InsuranceProduct.ProductType.HEALTH,
                "Comprehensive health coverage for individuals and families.", true));
        productService.createProduct(new ProductRequest(
                "Motor Insurance", InsuranceProduct.ProductType.MOTOR,
                "Vehicle insurance covering accidents, theft and third-party liability.", true));
        productService.createProduct(new ProductRequest(
                "Life Insurance", InsuranceProduct.ProductType.LIFE,
                "Term and whole life insurance policies for financial protection.", true));
        productService.createProduct(new ProductRequest(
                "Travel Insurance", InsuranceProduct.ProductType.TRAVEL,
                "Travel coverage including trip cancellation, medical and baggage.", true));

        System.out.println("Demo insurance products seeded successfully.");
    }

    private void seedPlans(PlanService planService,
                           InsuranceProductRepository productRepository,
                           PolicyPlanRepository planRepository) {
        if (planRepository.count() > 0) {
            return;
        }

        Optional<InsuranceProduct> health = productRepository.findByProductName("Health Insurance");
        Optional<InsuranceProduct> motor = productRepository.findByProductName("Motor Insurance");
        Optional<InsuranceProduct> life = productRepository.findByProductName("Life Insurance");
        Optional<InsuranceProduct> travel = productRepository.findByProductName("Travel Insurance");

        health.ifPresent(p -> {
            planService.createPlan(new PlanRequest(p.getId(), "Health Basic", new BigDecimal("100000"),
                    new BigDecimal("5000"), PolicyPlan.PremiumType.ONE_TIME, 1, "Basic health plan.", true));
            planService.createPlan(new PlanRequest(p.getId(), "Health Premium", new BigDecimal("500000"),
                    new BigDecimal("15000"), PolicyPlan.PremiumType.ANNUAL, 2, "Premium health plan.", true));
        });

        motor.ifPresent(p -> {
            planService.createPlan(new PlanRequest(p.getId(), "Motor Comprehensive", new BigDecimal("300000"),
                    new BigDecimal("12000"), PolicyPlan.PremiumType.ONE_TIME, 1, "Comprehensive motor cover.", true));
            planService.createPlan(new PlanRequest(p.getId(), "Motor Third Party", new BigDecimal("100000"),
                    new BigDecimal("4000"), PolicyPlan.PremiumType.ANNUAL, 1, "Third party motor insurance.", true));
        });

        life.ifPresent(p -> planService.createPlan(new PlanRequest(p.getId(), "Life Term 20", new BigDecimal("1000000"),
                new BigDecimal("25000"), PolicyPlan.PremiumType.ANNUAL, 20, "20-year term life.", true)));

        travel.ifPresent(p -> planService.createPlan(new PlanRequest(p.getId(), "Travel Standard", new BigDecimal("200000"),
                new BigDecimal("3000"), PolicyPlan.PremiumType.ONE_TIME, 1, "Standard travel cover.", true)));

        System.out.println("Demo policy plans seeded successfully.");
    }
}
