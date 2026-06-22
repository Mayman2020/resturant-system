package com.restaurantmanagement.modules.branches.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BranchResponse {
    private Long id;
    private String name;
    private String code;
    private String address;
    private String phone;
    private String email;
    private String timezone;
    private BigDecimal taxRate;
    private BigDecimal serviceCharge;
    private boolean active;
}
