package com.restaurantmanagement.modules.orders.dto;
import com.restaurantmanagement.modules.orders.entity.OrderStatus;
import jakarta.validation.constraints.NotNull; import lombok.Data;
@Data public class OrderStatusRequest { @NotNull private OrderStatus status; }
