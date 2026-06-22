package com.restaurantmanagement.modules.orders.dto;
import jakarta.validation.constraints.NotEmpty; import lombok.Data; import java.util.List;
@Data public class MergeOrdersRequest { @NotEmpty private List<Long> orderIds; }
