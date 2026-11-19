package com.insurance.insurancemgmt.common.dto;

import java.time.LocalDateTime;

public class ErrorResponse {

    private LocalDateTime timestamp;
    private Integer statusCode;
    private String errorType;
    private String message;
    private String path;

    public ErrorResponse() {
    }

    public ErrorResponse(LocalDateTime timestamp, Integer statusCode, String errorType,
                         String message, String path) {
        this.timestamp = timestamp;
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.message = message;
        this.path = path;
    }

    public static ErrorResponse of(LocalDateTime timestamp, Integer statusCode, String errorType,
                                   String message, String path) {
        ErrorResponse error = new ErrorResponse();
        error.timestamp = timestamp;
        error.statusCode = statusCode;
        error.errorType = errorType;
        error.message = message;
        error.path = path;
        return error;
    }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public Integer getStatusCode() { return statusCode; }
    public void setStatusCode(Integer statusCode) { this.statusCode = statusCode; }
    public String getErrorType() { return errorType; }
    public void setErrorType(String errorType) { this.errorType = errorType; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
}
