package com.restaurantmanagement.modules.reports.dto;
import lombok.Builder; import lombok.Data;
@Data @Builder public class StaffPerformanceResponse {
    private Long staffId; private String staffName; private String role; private long ordersHandled;
}
