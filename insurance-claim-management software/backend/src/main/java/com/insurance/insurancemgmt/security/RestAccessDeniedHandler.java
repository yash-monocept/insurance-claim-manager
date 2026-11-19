package com.insurance.insurancemgmt.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.insurance.insurancemgmt.common.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Returns a structured 403 response when an authenticated user lacks the role
 * required for an operation (EXC-008, SEC-AUTHZ-007).
 */
@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    private static final Logger log = LoggerFactory.getLogger(RestAccessDeniedHandler.class);

    private final ObjectMapper objectMapper;

    public RestAccessDeniedHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        log.warn("Security failure: forbidden access to {} {} - {}",
                request.getMethod(), request.getRequestURI(), accessDeniedException.getMessage());

        ErrorResponse error = ErrorResponse.of(
                LocalDateTime.now(),
                403,
                "ACCESS_DENIED",
                "Access denied: insufficient permissions for this operation",
                request.getRequestURI()
        );

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), error);
    }
}
