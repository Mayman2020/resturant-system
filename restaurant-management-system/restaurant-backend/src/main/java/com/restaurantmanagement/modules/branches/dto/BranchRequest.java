package com.restaurantmanagement.modules.branches.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BranchRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String code;
    private String address;
    private String phone;
    private String email;
    private String timezone;
    private BigDecimal taxRate;
    private BigDecimal serviceCharge;
    private Boolean active;
}
