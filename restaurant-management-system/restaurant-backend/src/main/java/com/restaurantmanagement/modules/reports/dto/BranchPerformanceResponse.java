package com.restaurantmanagement.modules.reports.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal;
@Data @Builder public class BranchPerformanceResponse {
    private Long branchId; private String branchName; private long orders; private BigDecimal sales;
}
