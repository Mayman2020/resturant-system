package com.restaurantmanagement.modules.loyalty.dto;
import jakarta.validation.constraints.NotNull; import lombok.Data;
@Data public class AdjustPointsRequest { @NotNull private Integer points; private String tier; }
