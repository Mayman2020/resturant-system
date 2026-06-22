package com.restaurantmanagement.modules.orders.dto;
import com.restaurantmanagement.modules.orders.entity.OrderType;
import jakarta.validation.constraints.NotNull; import lombok.Data;
import java.util.List;
@Data public class OrderRequest {
    @NotNull private Long branchId; private Long tableId; private Long customerId; private Long waiterId;
    @NotNull private OrderType orderType; private String notes; private List<OrderItemRequest> items;
}
