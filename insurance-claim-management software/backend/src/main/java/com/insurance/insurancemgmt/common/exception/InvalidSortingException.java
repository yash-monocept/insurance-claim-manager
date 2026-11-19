package com.insurance.insurancemgmt.common.exception;

public class InvalidSortingException extends BusinessException {

    public InvalidSortingException(String message) {
        super(message, "INVALID_SORTING", 400);
    }
}
