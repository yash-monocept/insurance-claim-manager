package com.insurance.insurancemgmt.common.exception;

public class AccessDeniedBusinessException extends BusinessException {

    public AccessDeniedBusinessException(String message) {
        super(message, "ACCESS_DENIED", 403);
    }
}
