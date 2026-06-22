package com.restaurantmanagement.modules.reports.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal;
@Data @Builder public class ProfitMarginResponse {
    private BigDecimal revenue; private BigDecimal estimatedCost; private BigDecimal margin; private BigDecimal marginPercent;
}
