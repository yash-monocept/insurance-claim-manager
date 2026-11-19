package com.insurance.insurancemgmt.common.exception;

public class InvalidPaginationException extends BusinessException {

    public InvalidPaginationException(String message) {
        super(message, "INVALID_PAGINATION", 400);
    }
}
