package com.restaurantmanagement.modules.billing.mapper;
import com.restaurantmanagement.modules.billing.dto.ReceiptResponse;
import com.restaurantmanagement.modules.billing.entity.Receipt;
public final class ReceiptMapper {
    private ReceiptMapper() {}
    public static ReceiptResponse toResponse(Receipt r) {
        return ReceiptResponse.builder().id(r.getId()).orderId(r.getOrderId()).receiptNumber(r.getReceiptNumber())
                .subtotal(r.getSubtotal()).taxAmount(r.getTaxAmount()).serviceCharge(r.getServiceCharge())
                .tipAmount(r.getTipAmount()).discountAmount(r.getDiscountAmount()).totalAmount(r.getTotalAmount())
                .printedAt(r.getPrintedAt()).createdAt(r.getCreatedAt()).build();
    }
}
