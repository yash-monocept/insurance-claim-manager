package com.insurance.insurancemgmt.common.exception;

public class BusinessException extends RuntimeException {

    private final String errorCode;
    private final Integer statusCode;

    public BusinessException(String message, String errorCode, Integer statusCode) {
        super(message);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }

    public BusinessException(String message, String errorCode) {
        this(message, errorCode, 400);
    }

    public String getErrorCode() { return errorCode; }
    public Integer getStatusCode() { return statusCode; }
}
