package com.restaurantmanagement.modules.kitchen.dto;
import com.restaurantmanagement.modules.orders.dto.OrderResponse;
import lombok.Builder; import lombok.Data; import java.util.List;
@Data @Builder public class KitchenOrderResponse { private Long branchId; private List<OrderResponse> orders; }
