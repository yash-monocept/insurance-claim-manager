package com.insurance.insurancemgmt.common.util;

import com.insurance.insurancemgmt.common.exception.InvalidPaginationException;
import com.insurance.insurancemgmt.common.exception.InvalidSortingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;

import java.util.Locale;
import java.util.Set;

/**
 * Central validation for pagination and sorting inputs so every list API
 * behaves consistently (PAG-RUL-001..010, SRT-RUL-001..005).
 */
public final class QueryValidator {

    public static final int DEFAULT_PAGE = 1;
    public static final int DEFAULT_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_FIELD = "createdDate";
    public static final String DEFAULT_SORT_DIRECTION = "desc";

    private static final Logger log = LoggerFactory.getLogger(QueryValidator.class);

    private QueryValidator() {
    }

    public static void validatePagination(int page, int size) {
        if (page < 1) {
            log.warn("Rejected pagination request: page={}", page);
            throw new InvalidPaginationException("Page number must be greater than or equal to 1");
        }
        if (size < 1) {
            log.warn("Rejected pagination request: size={}", size);
            throw new InvalidPaginationException("Page size must be greater than or equal to 1");
        }
        if (size > MAX_PAGE_SIZE) {
            log.warn("Rejected pagination request: size={} exceeds maximum {}", size, MAX_PAGE_SIZE);
            throw new InvalidPaginationException("Page size must not exceed " + MAX_PAGE_SIZE);
        }
    }

    public static String normalizeDirection(String sortDir) {
        if (sortDir == null || sortDir.isBlank()) {
            return DEFAULT_SORT_DIRECTION;
        }
        String direction = sortDir.trim().toLowerCase(Locale.ROOT);
        if (!direction.equals("asc") && !direction.equals("desc")) {
            log.warn("Rejected sorting request: invalid direction '{}'", sortDir);
            throw new InvalidSortingException(
                    "Invalid sort direction '" + sortDir + "'. Allowed values: asc, desc");
        }
        return direction;
    }

    public static Sort buildSort(String sortField, String sortDir, Set<String> allowedFields) {
        String field = (sortField == null || sortField.isBlank())
                ? DEFAULT_SORT_FIELD
                : sortField.trim();
        if (!allowedFields.contains(field)) {
            log.warn("Rejected sorting request: invalid sort field '{}'", sortField);
            throw new InvalidSortingException(
                    "Invalid sort field '" + field + "'. Allowed fields: " + String.join(", ", allowedFields));
        }
        String direction = normalizeDirection(sortDir);
        return direction.equals("asc")
                ? Sort.by(field).ascending()
                : Sort.by(field).descending();
    }
}
