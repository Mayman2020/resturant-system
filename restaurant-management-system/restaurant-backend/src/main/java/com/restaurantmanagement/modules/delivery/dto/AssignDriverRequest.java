package com.restaurantmanagement.modules.delivery.dto;
import jakarta.validation.constraints.NotNull; import lombok.Data;
@Data public class AssignDriverRequest { @NotNull private Long driverId; }
