package com.restaurantmanagement.modules.delivery.dto;
import com.restaurantmanagement.modules.delivery.entity.DeliveryStatus;
import jakarta.validation.constraints.NotNull; import lombok.Data;
@Data public class DeliveryStatusRequest { @NotNull private DeliveryStatus status; }
