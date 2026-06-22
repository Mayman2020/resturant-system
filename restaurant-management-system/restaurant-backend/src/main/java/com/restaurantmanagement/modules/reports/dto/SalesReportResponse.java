package com.restaurantmanagement.modules.reports.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal;
@Data @Builder public class SalesReportResponse {
    private Long branchId; private String period; private long orderCount; private BigDecimal totalSales;
}
