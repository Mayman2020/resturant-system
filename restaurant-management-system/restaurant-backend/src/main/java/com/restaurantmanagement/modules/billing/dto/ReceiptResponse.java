package com.restaurantmanagement.modules.billing.dto;
import lombok.Builder; import lombok.Data; import java.math.BigDecimal; import java.time.LocalDateTime;
@Data @Builder public class ReceiptResponse {
    private Long id; private Long orderId; private String receiptNumber; private BigDecimal subtotal;
    private BigDecimal taxAmount; private BigDecimal serviceCharge; private BigDecimal tipAmount;
    private BigDecimal discountAmount; private BigDecimal totalAmount; private LocalDateTime printedAt; private LocalDateTime createdAt;
}
