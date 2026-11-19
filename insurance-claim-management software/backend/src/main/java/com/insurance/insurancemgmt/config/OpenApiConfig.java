package com.insurance.insurancemgmt.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger documentation configuration.
 *
 * Covers SWG-001..SWG-006: title, description, version, authentication,
 * JWT bearer usage and module groups.
 */
@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI insuranceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Insurance Policy and Claim Management System API")
                        .description("""
                                REST API for managing insurance products, policy plans, customers, policies,
                                premium payments and claims. Uses JWT-based authentication with three roles:
                                ADMIN, AGENT and CUSTOMER.

                                **How to authenticate:** call `POST /api/auth/login` with a demo account, copy the
                                `token` from the response and click **Authorize**, then paste the token.
                                """)
                        .version("1.0.0"))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components().addSecuritySchemes(SECURITY_SCHEME_NAME,
                        new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT token returned by POST /api/auth/login")));
    }

    @Bean
    public GroupedOpenApi allApi() {
        return GroupedOpenApi.builder()
                .group("00-all-apis")
                .pathsToMatch("/api/**")
                .build();
    }

    @Bean
    public GroupedOpenApi authApi() {
        return GroupedOpenApi.builder()
                .group("01-authentication")
                .pathsToMatch("/api/auth/**")
                .build();
    }

    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder()
                .group("02-users")
                .pathsToMatch("/api/admin/users/**")
                .build();
    }

    @Bean
    public GroupedOpenApi customerApi() {
        return GroupedOpenApi.builder()
                .group("03-customers")
                .pathsToMatch("/api/customers/**")
                .build();
    }

    @Bean
    public GroupedOpenApi productApi() {
        return GroupedOpenApi.builder()
                .group("04-products")
                .pathsToMatch("/api/admin/products/**", "/api/products/**")
                .build();
    }

    @Bean
    public GroupedOpenApi planApi() {
        return GroupedOpenApi.builder()
                .group("05-plans")
                .pathsToMatch("/api/plans/**")
                .build();
    }

    @Bean
    public GroupedOpenApi policyApi() {
        return GroupedOpenApi.builder()
                .group("06-policies")
                .pathsToMatch("/api/policies/**")
                .build();
    }

    @Bean
    public GroupedOpenApi paymentApi() {
        return GroupedOpenApi.builder()
                .group("07-payments")
                .pathsToMatch("/api/payments/**")
                .build();
    }

    @Bean
    public GroupedOpenApi claimApi() {
        return GroupedOpenApi.builder()
                .group("08-claims")
                .pathsToMatch("/api/claims/**")
                .pathsToExclude("/api/claims/*/history")
                .build();
    }

    @Bean
    public GroupedOpenApi claimHistoryApi() {
        return GroupedOpenApi.builder()
                .group("09-claim-history")
                .pathsToMatch("/api/claims/*/history")
                .build();
    }

    @Bean
    public GroupedOpenApi dashboardApi() {
        return GroupedOpenApi.builder()
                .group("10-dashboard")
                .pathsToMatch("/api/dashboard/**")
                .build();
    }
}
