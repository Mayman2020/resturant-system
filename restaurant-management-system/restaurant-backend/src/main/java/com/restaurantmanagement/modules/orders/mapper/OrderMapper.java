package com.restaurantmanagement.modules.orders.mapper;
import com.restaurantmanagement.modules.orders.dto.*;
import com.restaurantmanagement.modules.orders.entity.*;
import java.util.List;
public final class OrderMapper {
    private OrderMapper() {}
    public static OrderResponse toResponse(OrderEntity o) {
        return OrderResponse.builder().id(o.getId()).orderNumber(o.getOrderNumber()).branchId(o.getBranchId())
                .tableId(o.getTableId()).customerId(o.getCustomerId()).waiterId(o.getWaiterId())
                .orderType(o.getOrderType()).status(o.getStatus()).subtotal(o.getSubtotal())
                .discountAmount(o.getDiscountAmount()).taxAmount(o.getTaxAmount())
                .serviceCharge(o.getServiceCharge()).tipAmount(o.getTipAmount()).totalAmount(o.getTotalAmount())
                .notes(o.getNotes()).held(o.isHeld()).createdAt(o.getCreatedAt())
                .items(o.getItems() != null ? o.getItems().stream().map(OrderMapper::toItem).toList() : List.of()).build();
    }
    public static OrderItemResponse toItem(OrderItem i) {
        return OrderItemResponse.builder().id(i.getId()).menuItemId(i.getMenuItemId()).itemName(i.getItemName())
                .quantity(i.getQuantity()).unitPrice(i.getUnitPrice()).lineTotal(i.getLineTotal())
                .notes(i.getNotes()).modifiers(i.getModifiersJson()).build();
    }
}
