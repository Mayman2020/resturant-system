package com.restaurantmanagement.modules.delivery.mapper;
import com.restaurantmanagement.modules.delivery.dto.DeliveryResponse;
import com.restaurantmanagement.modules.delivery.entity.DeliveryOrder;
public final class DeliveryMapper {
    private DeliveryMapper() {}
    public static DeliveryResponse toResponse(DeliveryOrder d) {
        return DeliveryResponse.builder().id(d.getId()).orderId(d.getOrderId()).driverId(d.getDriverId())
                .deliveryAddress(d.getDeliveryAddress()).deliveryFee(d.getDeliveryFee())
                .estimatedMinutes(d.getEstimatedMinutes()).status(d.getStatus())
                .assignedAt(d.getAssignedAt()).deliveredAt(d.getDeliveredAt()).build();
    }
}
