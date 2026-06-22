package com.restaurantmanagement.modules.dashboard.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal;
@Data @Builder public class DashboardSummaryResponse {
    private Long branchId; private long todayOrders; private BigDecimal todaySales;
    private long activeOrders; private long lowStockItems; private long totalCustomers; private long staffCount;
}
