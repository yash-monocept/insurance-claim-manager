package com.insurance.insurancemgmt.common.exception;

public class InvalidTokenException extends BusinessException {

    public InvalidTokenException(String message) {
        super(message, "INVALID_TOKEN", 401);
    }
}
