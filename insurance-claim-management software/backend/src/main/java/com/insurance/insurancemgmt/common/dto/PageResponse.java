package com.insurance.insurancemgmt.common.dto;

import java.util.List;

public class PageResponse<T> {

    private List<T> records;
    private Integer currentPage;
    private Integer pageSize;
    private Long totalRecords;
    private Integer totalPages;
    private Boolean lastPage;
    private String sortField;
    private String sortDirection;

    public PageResponse() {
    }

    public PageResponse(List<T> records, Integer currentPage, Integer pageSize, Long totalRecords,
                        Integer totalPages, Boolean lastPage, String sortField, String sortDirection) {
        this.records = records;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalRecords = totalRecords;
        this.totalPages = totalPages;
        this.lastPage = lastPage;
        this.sortField = sortField;
        this.sortDirection = sortDirection;
    }

    public static <T> PageResponse<T> of(List<T> records, Integer currentPage, Integer pageSize,
                                         Long totalRecords, Integer totalPages, Boolean lastPage,
                                         String sortField, String sortDirection) {
        return new PageResponse<>(records, currentPage, pageSize, totalRecords, totalPages, lastPage,
                sortField, sortDirection);
    }

    public List<T> getRecords() { return records; }
    public void setRecords(List<T> records) { this.records = records; }
    public Integer getCurrentPage() { return currentPage; }
    public void setCurrentPage(Integer currentPage) { this.currentPage = currentPage; }
    public Integer getPageSize() { return pageSize; }
    public void setPageSize(Integer pageSize) { this.pageSize = pageSize; }
    public Long getTotalRecords() { return totalRecords; }
    public void setTotalRecords(Long totalRecords) { this.totalRecords = totalRecords; }
    public Integer getTotalPages() { return totalPages; }
    public void setTotalPages(Integer totalPages) { this.totalPages = totalPages; }
    public Boolean getLastPage() { return lastPage; }
    public void setLastPage(Boolean lastPage) { this.lastPage = lastPage; }
    public String getSortField() { return sortField; }
    public void setSortField(String sortField) { this.sortField = sortField; }
    public String getSortDirection() { return sortDirection; }
    public void setSortDirection(String sortDirection) { this.sortDirection = sortDirection; }
}
