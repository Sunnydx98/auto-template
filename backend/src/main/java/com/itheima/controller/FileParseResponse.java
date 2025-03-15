package com.itheima.controller;
import java.util.List;

public class FileParseResponse {

    private List<String> hqlStatementsFact;
    private List<String> hqlStatementsLoad;
    private int totalPages;
    private int pageSize;

    public FileParseResponse(List<String> hqlStatementsFact, List<String> hqlStatementsLoad, int totalPages, int pageSize) {
        this.hqlStatementsFact = hqlStatementsFact;
        this.hqlStatementsLoad = hqlStatementsLoad;
        this.totalPages = totalPages;
        this.pageSize = pageSize;
    }

    public List<String> getHqlStatementsFact() {
        return hqlStatementsFact;
    }

    public List<String> getHqlStatementsLoad() {
        return hqlStatementsLoad;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public int getPageSize() {
        return pageSize;
    }
}
